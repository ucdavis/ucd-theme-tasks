import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import newsite from '../lib/newsite.js'
import defaultConfig from '../tasks-config.default.mjs'

const originalCwd = process.cwd()
let root
let theme

const config = () => {
  const c = structuredClone(defaultConfig)
  c.themeSync.dest = theme
  return c
}

beforeEach(async (t) => {
  t.mock.method(console, 'info', () => {})
  t.mock.method(console, 'error', () => {})
  t.mock.method(console, 'log', () => {})

  root = await mkdtemp(join(tmpdir(), 'ucd-newsite-'))
  theme = join(root, 'theme')

  // Pattern Lab project with a starterkit.
  const pl = join(root, 'pl')
  await mkdir(join(pl, 'starterkit/templates'), { recursive: true })
  await mkdir(join(pl, 'source/sass'), { recursive: true })
  await mkdir(join(pl, 'source/js'), { recursive: true })
  await mkdir(join(pl, 'source/images/sample'), { recursive: true })
  await writeFile(join(pl, 'starterkit/theme.info.yml'), 'name: Starter')
  await writeFile(join(pl, 'starterkit/templates/page.html.twig'), '<main></main>')
  await writeFile(join(pl, 'source/sass/style.scss'), 'body {}')
  await writeFile(join(pl, 'source/js/app.js'), 'export {}')
  await writeFile(join(pl, 'source/images/logo.png'), 'png')
  await writeFile(join(pl, 'source/images/sample/sample.png'), 'png')

  process.chdir(pl)
})

afterEach(async () => {
  process.chdir(originalCwd)
  await rm(root, { recursive: true, force: true })
})

test('newsite copies the starterkit, starter files, and synced assets', async () => {
  await newsite(config(), {})

  // Starterkit.
  assert.ok(existsSync(join(theme, 'theme.info.yml')))
  assert.ok(existsSync(join(theme, 'templates/page.html.twig')))
  // Starter files.
  assert.ok(existsSync(join(theme, 'vite.config.mjs')))
  assert.ok(existsSync(join(theme, '.stylelintrc.yml')))
  assert.ok(existsSync(join(theme, 'tasks-config.mjs')))
  // Synced assets.
  assert.ok(existsSync(join(theme, 'sass/1_pattern_lab/style.scss')))
  assert.ok(existsSync(join(theme, 'js/1_pattern_lab/app.js')))
  assert.ok(existsSync(join(theme, 'images/logo.png')))
  assert.ok(!existsSync(join(theme, 'images/sample')), 'sample images should not be copied')
})

test('newsite does not add tasks-config.mjs next to a legacy tasks-config.js', async () => {
  await writeFile('starterkit/tasks-config.js', 'export default {}')

  await newsite(config(), { force: true })

  assert.ok(existsSync(join(theme, 'tasks-config.js')))
  assert.ok(!existsSync(join(theme, 'tasks-config.mjs')), 'tasks-config.mjs would shadow the existing tasks-config.js')
})

test('newsite keeps existing files unless --force is used', async () => {
  await mkdir(theme)
  await writeFile(join(theme, 'theme.info.yml'), 'name: Custom')

  await newsite(config(), {})
  assert.equal(await readFile(join(theme, 'theme.info.yml'), 'utf8'), 'name: Custom')

  await newsite(config(), { force: true })
  assert.equal(await readFile(join(theme, 'theme.info.yml'), 'utf8'), 'name: Starter')
})

test('newsite stops without copying anything when there is no starterkit', async () => {
  await rm('starterkit', { recursive: true })

  await newsite(config(), {})

  assert.ok(!existsSync(theme))
  assert.equal(console.error.mock.callCount(), 1)
})
