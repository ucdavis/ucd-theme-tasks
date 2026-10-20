import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sync, { resolveSyncPaths } from '../lib/sync.js'
import defaultConfig from '../tasks-config.default.mjs'

const config = () => structuredClone(defaultConfig)

test('resolveSyncPaths defaults to an export into the destination theme', () => {
  const paths = resolveSyncPaths(config(), {})

  assert.equal(paths.sassSrc, 'source/sass/')
  assert.equal(paths.sassDest, '../theme/sass/1_pattern_lab/')
  assert.equal(paths.jsSrc, 'source/js/')
  assert.equal(paths.jsDest, '../theme/js/1_pattern_lab/')
  assert.equal(paths.imagesDest, '../theme/images/')
  assert.equal(paths.fontDest, '../theme/fonts/')
})

test('resolveSyncPaths flips to an import when a src is given', () => {
  const paths = resolveSyncPaths(config(), { src: '../patternlab' })

  assert.equal(paths.sassSrc, '../patternlab/source/sass/')
  assert.equal(paths.sassDest, 'sass/1_pattern_lab/')
  assert.equal(paths.jsSrc, '../patternlab/source/js/')
  assert.equal(paths.jsDest, 'js/1_pattern_lab/')
})

test('resolveSyncPaths honors a --dest override', () => {
  const paths = resolveSyncPaths(config(), { dest: '../other-theme' })

  assert.equal(paths.sassDest, '../other-theme/sass/1_pattern_lab/')
  assert.equal(paths.fontDest, '../other-theme/fonts/')
})

// Integration: run a real export sync against a fixture tree in a temp dir.
let root
const originalCwd = process.cwd()

before(async () => {
  root = await mkdtemp(join(tmpdir(), 'ucd-sync-'))

  // Pattern Lab side.
  await mkdir(join(root, 'pl/source/sass'), { recursive: true })
  await mkdir(join(root, 'pl/source/js'), { recursive: true })
  await mkdir(join(root, 'pl/source/images/sample'), { recursive: true })
  await mkdir(join(root, 'pl/source/fonts'), { recursive: true })
  await writeFile(join(root, 'pl/source/sass/style.scss'), 'body { color: red; }')
  await writeFile(join(root, 'pl/source/sass/_partial.scss'), '$var: 1;')
  await writeFile(join(root, 'pl/source/js/app.js'), 'console.log("app")')
  await writeFile(join(root, 'pl/source/images/logo.png'), 'png')
  await writeFile(join(root, 'pl/source/images/sample/sample.png'), 'png')
  await writeFile(join(root, 'pl/source/fonts/font.woff'), 'woff')

  // Theme side with stale synced files that must be replaced.
  await mkdir(join(root, 'theme/sass/1_pattern_lab'), { recursive: true })
  await mkdir(join(root, 'theme/js/1_pattern_lab'), { recursive: true })
  await writeFile(join(root, 'theme/sass/1_pattern_lab/old.scss'), 'old')
  await writeFile(join(root, 'theme/js/1_pattern_lab/old.js'), 'old')

  process.chdir(join(root, 'pl'))
})

after(async () => {
  process.chdir(originalCwd)
  await rm(root, { recursive: true, force: true })
})

test('sync exports assets and is fully finished when it resolves', async () => {
  await sync(config(), {})

  const theme = join(root, 'theme')

  // Sass and js directories are delete-and-replaced.
  assert.equal(readFileSync(join(theme, 'sass/1_pattern_lab/style.scss'), 'utf8'), 'body { color: red; }')
  assert.ok(existsSync(join(theme, 'sass/1_pattern_lab/_partial.scss')))
  assert.ok(!existsSync(join(theme, 'sass/1_pattern_lab/old.scss')), 'stale sass file should be deleted')
  assert.ok(existsSync(join(theme, 'js/1_pattern_lab/app.js')))
  assert.ok(!existsSync(join(theme, 'js/1_pattern_lab/old.js')), 'stale js file should be deleted')

  // Images are copied, excluding the sample directory.
  assert.ok(existsSync(join(theme, 'images/logo.png')))
  assert.ok(!existsSync(join(theme, 'images/sample')), 'sample images should not be synced')

  // Fonts are copied.
  assert.ok(existsSync(join(theme, 'fonts/font.woff')))
})

test('sync imports assets into the current project when src is set', async () => {
  // A fresh project, so files left by the export test can't make this pass.
  const project = join(root, 'importer')
  await mkdir(project)
  process.chdir(project)

  await sync(config(), { src: '../pl/' })

  assert.ok(existsSync(join(project, 'sass/1_pattern_lab/style.scss')))
  assert.ok(existsSync(join(project, 'js/1_pattern_lab/app.js')))
  assert.ok(existsSync(join(project, 'images/logo.png')))
  assert.ok(!existsSync(join(project, 'images/sample')))
  assert.ok(existsSync(join(project, 'fonts/font.woff')))
})
