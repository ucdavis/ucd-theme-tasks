import { readFileSync, existsSync, rmdirSync, copyFile } from 'fs'
import { join, resolve } from 'path'
import chokidar from 'chokidar'
import patternLabCore from '@pattern-lab/core'
let plConfig = {}

// Load in Pattern Lab config.
try {
  const buffer = readFileSync('./patternlab-config.json')
  plConfig = JSON.parse(buffer.toString())
} catch (e) {
  console.error('No patternlab-config.json file could be found. Are you using Pattern Lab?')
  process.exit()
}

const getWatchPatterns = () => {
  const plSource = plConfig.paths.source
  const createWatchPath = (key, pattern) => {
    if (plSource[key]) {
      return join(resolve(plSource[key]), pattern)
    }
    return false
  }

  const defaultPatterns = [
    ['patterns', '**/*.hbs'],
    ['patterns', '**/*.mustache'],
    ['patterns', '**/*.json'],
    ['patterns', '**/*.md'],
    ['data', '*.json'],
    ['meta', '*'],
    ['annotations', '*'],
    ['images', '*'],
    ['fonts', '*'],
    ['pl', '**/*'],
    ['js', '**/*.js'],
    ['sass', '**/*.scss'],
  ]

  return defaultPatterns.flatMap((pattern) => createWatchPath(pattern[0], pattern[1]) || [])
}

export default async function patternlab (options) {
  const clean = plConfig.cleanPublic
  // Force the cleanPublic to be false so that partial rebuilds can happen.
  plConfig.cleanPublic = false

  const patternlab = patternLabCore(plConfig)

  /**
   * Build Pattern Lab.
   *
   * @return {Promise<void>}
   */
  const build = async () => {
    // Remove the public directory.
    if (clean && existsSync('./public')) {
      rmdirSync('./public', { recursive: true })
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
  const buildChangedPattern = async (changedFile) => {
    // Check if the changed file was a javascript or sass file. If so, copy it
    // into the public directory so that vite can pick it up. Then exit.
    if (/(js|scss)$/.test(changedFile)) {
      const regex = /(source)\/(sass|js)+/i
      const destFile = changedFile.replace(regex, 'public/$2')

      copyFile(changedFile, destFile, (err) => {
        if (err) throw err
      })
      return
    }

    // If this is a data or pattern lab file, we need to rebuild everything.
    let clean = false
    if (/source\/_(data|meta|annotations|pl)/.test(changedFile)) {
      clean = true
    }

    await patternlab.patternsonly({
      cleanPublic: clean,
    })
  }

  if (options.watch) {
    const watchPatterns = getWatchPatterns()
    chokidar.watch(watchPatterns).on('change', buildChangedPattern)
  } else {
    await build()
  }
}
