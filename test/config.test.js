import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadConfig } from '../lib/config.js'
import defaultConfig from '../tasks-config.default.mjs'

const fixture = (name) => `${import.meta.dirname}/fixtures/config/${name}/`

test('defaults are used when no project config exists', async () => {
  const { config, projectConfig, configMessage } = await loadConfig(fixture('empty'))

  assert.deepEqual(config, defaultConfig)
  assert.equal(projectConfig, false)
  assert.equal(configMessage, 'Add a tasks-config.js file for any project specific configuration.')
})

test('project tasks-config.js deep-merges over the defaults', async () => {
  const { config, projectConfig, configMessage } = await loadConfig(fixture('project'))

  // Overridden values.
  assert.equal(config.themeSync.dest, '../custom-theme/')
  assert.equal(config.themeSync.sassSync, false)
  // Untouched defaults survive the merge.
  assert.equal(config.themeSync.jsSync, true)
  assert.equal(config.themeSync.sassSrc, 'source/sass/')
  assert.notEqual(projectConfig, false)
  assert.equal(configMessage, 'Add a tasks-config.local.js file for any custom local configuration.')
})

test('tasks-config.local.js wins over the project config', async () => {
  const { config, configMessage } = await loadConfig(fixture('project-local'))

  // Local overrides project.
  assert.equal(config.themeSync.dest, '../local-theme/')
  // Project overrides defaults.
  assert.equal(config.themeSync.jsSync, false)
  // Defaults still present.
  assert.equal(config.themeSync.sassSync, true)
  // Both configs exist so no suggestion is needed.
  assert.equal(configMessage, '')
})

test('loading a project config does not mutate the shared defaults', async () => {
  await loadConfig(fixture('project'))
  const { config } = await loadConfig(fixture('empty'))

  assert.equal(config.themeSync.dest, '../theme/')
  assert.equal(config.themeSync.sassSync, true)
})
