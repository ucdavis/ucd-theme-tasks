import _ from 'lodash'
import defaultConfig from '../tasks-config.default.mjs'

/**
 * Load the task configuration for a project by merging three layers:
 * tasks-config.default.mjs (this package) <- the project's tasks-config.js
 * <- the project's tasks-config.local.js.
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
  try {
    const { default: taskConfig } = await import(`${parentPath}tasks-config.js`)
    projectConfig = taskConfig
    config = _.merge(config, projectConfig)
  } catch (e) {
    configMessage = 'Add a tasks-config.js file for any project specific configuration.'
  }

  // Load in custom local config.
  try {
    const { default: customConfig } = await import(`${parentPath}tasks-config.local.js`)
    config = _.merge(config, customConfig)
  }
  catch (e) {
    // Only add the option for a local config if a project config is already used.
    if (projectConfig) {
      configMessage = 'Add a tasks-config.local.js file for any custom local configuration.'
    }
  }

  return { config, projectConfig, configMessage }
}
