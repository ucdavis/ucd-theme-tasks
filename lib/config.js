import { existsSync } from 'node:fs'
import _ from 'lodash'
import defaultConfig from '../tasks-config.default.mjs'

/**
 * Import the default export of the first file that exists, or undefined.
 *
 * Missing files are skipped; a file that exists but fails to load throws.
 *
 * @param {string[]} paths
 * @return {Promise<object|undefined>}
 */
async function importFirst (paths) {
  for (const path of paths) {
    if (!existsSync(path)) continue

    try {
      const { default: config } = await import(path)
      return config
    } catch (error) {
      throw new Error(`Failed to load ${path}: ${error.message}`, { cause: error })
    }
  }
}

/**
 * Load the task configuration for a project by merging three layers:
 * tasks-config.default.mjs (this package) <- the project's tasks-config.mjs
 * <- the project's tasks-config.local.mjs. The legacy .js names also work.
 *
 * @param {string} parentPath Path (with trailing slash) to the consuming project.
 * @return {Promise<{config: object, projectConfig: object|false, configMessage: string}>}
 */
export async function loadConfig (parentPath) {
  // Merge into a new object so the shared defaults are never mutated.
  let config = _.merge({}, defaultConfig)
  let projectConfig = false
  let configMessage = ''

  // Load in Project specific config.
  const taskConfig = await importFirst([
    `${parentPath}tasks-config.mjs`,
    `${parentPath}tasks-config.js`,
  ])
  if (taskConfig) {
    projectConfig = taskConfig
    config = _.merge(config, projectConfig)
  } else {
    configMessage = 'Add a tasks-config.mjs file for any project specific configuration.'
  }

  // Load in custom local config.
  const customConfig = await importFirst([
    `${parentPath}tasks-config.local.mjs`,
    `${parentPath}tasks-config.local.js`,
  ])
  if (customConfig) {
    config = _.merge(config, customConfig)
  } else if (projectConfig) {
    // Only add the option for a local config if a project config is already used.
    configMessage = 'Add a tasks-config.local.mjs file for any custom local configuration.'
  }

  return { config, projectConfig, configMessage }
}
