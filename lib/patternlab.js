import { readFileSync, existsSync, rmSync, copyFileSync, mkdirSync } from 'fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'path'
import chokidar from 'chokidar'
import patternLabCore from '@pattern-lab/core'
// Internal, not public API; safe because patternlab-node was archived (May 2026).
import uiBuilder from '@pattern-lab/core/src/lib/ui_builder.js'
import { Pattern } from '@pattern-lab/core/src/lib/object_factory.js'

// Chokidar 4+ dropped glob support, so watch directories and filter files.
const getWatchTargets = (plConfig) => {
  const plSource = plConfig.paths.source

  const defaultTargets = [
    ['patterns', /\.(hbs|mustache|json|md)$/, true],
    ['data', /\.json$/, false],
    ['meta', null, false],
    ['annotations', null, false],
    ['images', null, false],
    ['fonts', null, false],
    ['pl', null, true],
    ['js', /\.js$/, true],
    ['sass', /\.scss$/, true],
  ]

  return defaultTargets.flatMap(([key, ext, recursive]) =>
    plSource[key] ? [{ dir: resolve(plSource[key]), ext, recursive }] : []
  )
}

const isWatchedFile = (targets, file) => targets.some(({ dir, ext, recursive }) => {
  const rel = relative(dir, file)
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return false
  if (!recursive && rel.includes(sep)) return false
  return !ext || ext.test(file)
})

export default async function patternlab (options) {
  // Load in Pattern Lab config.
  let plConfig = {}
  try {
    const buffer = readFileSync('./patternlab-config.json')
    plConfig = JSON.parse(buffer.toString())
  } catch (e) {
    console.error('No patternlab-config.json file could be found. Are you using Pattern Lab?')
    process.exit()
  }

  const clean = plConfig.cleanPublic
  // Force the cleanPublic to be false so that partial rebuilds can happen.
  plConfig.cleanPublic = false

  const patternlab = patternLabCore(plConfig)

  // The public API doesn't expose the internal instance that ui_builder needs.
  let plInstance
  patternlab.events.on('patternlab-build-start', ([instance]) => {
    plInstance = instance
  })

  /**
   * Build Pattern Lab.
   *
   * @return {Promise<void>}
   */
  const build = async () => {
    // Remove the public directory.
    if (clean && existsSync('./public')) {
      rmSync('./public', { recursive: true, force: true })
    }

    const plOptions = {
      cleanPublic: clean,
      // Pass in a "productionBuild" data value so that handlbar files can
      // conditionally change things if patternlab is being built for production
      // vs development.
      data: {'productionBuild': false}
    }

    if (options.prod) {
      plOptions.data.productionBuild = true
    }

    await patternlab.build(plOptions)
  }

  /**
   * Build individual Pattern Lab pattern or js/scss that has changed.
   *
   * @return {Promise<void>}
   */
  const buildChangedPattern = async (changedFile, event) => {
    // Check if the changed file was a javascript or sass file. If so, mirror it
    // into the public directory so that vite can pick it up. Then exit.
    if (/(js|scss)$/.test(changedFile)) {
      const regex = /(source)\/(sass|js)+/i
      const destFile = changedFile.replace(regex, 'public/$2')

      if (event === 'unlink') {
        rmSync(destFile, { force: true })
      } else {
        mkdirSync(dirname(destFile), { recursive: true })
        copyFileSync(changedFile, destFile)
      }
      return
    }

    // If this is a data or pattern lab file, we need to rebuild everything.
    let clean = false
    if (/source\/_(data|meta|annotations|pl)/.test(changedFile)) {
      clean = true
    }

    // Incremental builds prune deleted patterns from the graph but leave their output.
    if (event === 'unlink' && /\.(hbs|mustache)$/.test(changedFile)) {
      const relPath = relative(resolve(plConfig.paths.source.patterns), changedFile)
      if (!relPath.startsWith('..')) {
        const { name } = new Pattern(relPath, {}, { config: plConfig })
        rmSync(resolve(plConfig.paths.public.patterns, name), { recursive: true, force: true })
      }
    }

    await patternlab.patternsonly({ cleanPublic: clean })

    // Regenerate the styleguide nav for added/removed patterns. A full build()
    // would also re-copy every asset into public/ and flood Vite with reloads.
    if (event !== 'change' && plInstance) {
      await uiBuilder().buildFrontend(plInstance)
    }
  }

  if (options.watch) {
    const watchTargets = getWatchTargets(plConfig)
    chokidar
      .watch(watchTargets.map(({ dir }) => dir), { ignoreInitial: true })
      .on('all', (event, file) => {
        if (!['add', 'change', 'unlink'].includes(event)) return
        if (isWatchedFile(watchTargets, file)) buildChangedPattern(file, event)
      })
  } else {
    await build()
  }
}
