import { readFileSync, existsSync, rmSync, copyFileSync, mkdirSync } from 'fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'path'
import chokidar from 'chokidar'
// Must load before @pattern-lab/core so it can track Pattern Lab's copies.
import { copiesSettled } from './patternlab-copies.js'
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
    ['images', null, true],
    ['fonts', null, true],
    ['pl', null, true],
    ['js', /\.js$/, true],
    ['sass', /\.scss$/, true],
  ]

  return defaultTargets.flatMap(([key, ext, recursive]) =>
    plSource[key] ? [{ key, dir: resolve(plSource[key]), ext, recursive }] : []
  )
}

const findTarget = (targets, file) => targets.find(({ dir, ext, recursive }) => {
  const rel = relative(dir, file)
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return false
  if (!recursive && rel.includes(sep)) return false
  return !ext || ext.test(file)
})

// Asset directories are mirrored into public/ rather than rebuilding patterns.
const assetKeys = ['images', 'fonts', 'js', 'sass']

// Changes in these directories affect every pattern.
const globalKeys = ['data', 'meta', 'annotations', 'pl']

/**
 * Create a Pattern Lab instance that can be fully or incrementally rebuilt.
 *
 * @param {{prod?: boolean}} options
 * @return {{plConfig: object, watchDirs: string[], build: function, rebuild: function}}
 */
export function createPatternLab ({ prod = false } = {}) {
  let plConfig = {}
  try {
    const buffer = readFileSync('./patternlab-config.json')
    plConfig = JSON.parse(buffer.toString())
  } catch (e) {
    throw new Error('No patternlab-config.json file could be found. Are you using Pattern Lab?', { cause: e })
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

  const watchTargets = getWatchTargets(plConfig)

  /**
   * Build Pattern Lab.
   *
   * @return {Promise<void>}
   */
  const build = async () => {
    const publicRoot = plConfig.paths.public.root
    if (clean && existsSync(publicRoot)) {
      rmSync(publicRoot, { recursive: true, force: true })
    }

    await patternlab.build({
      cleanPublic: clean,
      // Lets Handlebars files switch between dev and production asset paths.
      data: { productionBuild: prod },
    })
    await copiesSettled()
  }

  /**
   * Rebuild what a changed source file affects.
   *
   * @param {string} changedFile Absolute path.
   * @param {string} event Chokidar event name.
   * @return {Promise<boolean>} Whether anything was rebuilt.
   */
  const buildChanged = async (changedFile, event) => {
    const target = findTarget(watchTargets, changedFile)
    if (!target) return false

    if (assetKeys.includes(target.key)) {
      const publicDir = plConfig.paths.public[target.key]
      if (!publicDir) return false
      const destFile = resolve(publicDir, relative(target.dir, changedFile))

      if (event === 'unlink') {
        rmSync(destFile, { force: true })
      } else {
        mkdirSync(dirname(destFile), { recursive: true })
        copyFileSync(changedFile, destFile)
      }
      return true
    }

    const clean = globalKeys.includes(target.key)

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
    return true
  }

  // Pattern Lab can't run overlapping builds, so serialize them.
  let queue = Promise.resolve()
  const enqueue = (task) => {
    const run = queue.then(task)
    queue = run.catch(() => {})
    return run
  }

  return {
    plConfig,
    watchDirs: watchTargets.map(({ dir }) => dir),
    build: () => enqueue(build),
    rebuild: (file, event) => enqueue(() => buildChanged(file, event)),
  }
}

export default async function patternlab (options) {
  let pl
  try {
    pl = createPatternLab({ prod: options.prod })
  } catch (e) {
    console.error(e.message)
    process.exit()
  }

  if (options.watch) {
    chokidar
      .watch(pl.watchDirs, { ignoreInitial: true })
      .on('all', (event, file) => {
        if (['add', 'change', 'unlink'].includes(event)) pl.rebuild(file, event)
      })
  } else {
    await pl.build()
  }
}
