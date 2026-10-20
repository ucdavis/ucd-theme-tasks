import { test, before, after, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import lint from '../lib/lint.js'

const repo = resolve(import.meta.dirname, '..')
const originalCwd = process.cwd()
const originalPath = process.env.PATH
const badScss = '.Foo {\n  color: #FFFFFF;\n}\n'
let root

before(async () => {
  root = await mkdtemp(join(tmpdir(), 'ucd-lint-'))

  // Point the project configs at this repo's defaults by absolute path.
  await writeFile(join(root, '.stylelintrc.yml'), `extends: ${join(repo, '.stylelintrc.default.yml')}\n`)
  await writeFile(join(root, 'eslint.config.mjs'), `export { default } from '${join(repo, 'eslint.config.default.mjs')}'\n`)
  await writeFile(join(root, 'prettier.config.mjs'), `export { default } from '${join(repo, 'prettier.config.default.mjs')}'\n`)

  // Clean files in the default lint locations, plus failing synced files that must be ignored.
  await mkdir(join(root, 'sass/1_pattern_lab'), { recursive: true })
  await mkdir(join(root, 'js/1_pattern_lab'), { recursive: true })
  await writeFile(join(root, 'sass/style.scss'), '.foo {\n  color: #fff;\n}\n')
  await writeFile(join(root, 'sass/1_pattern_lab/synced.scss'), badScss)
  await writeFile(join(root, 'js/clean.js'), "export const greeting = 'hi';\n")
  await writeFile(join(root, 'js/1_pattern_lab/synced.js'), 'const unused = 1\n')

  // Failing files outside the default globs, linted only when targeted.
  await mkdir(join(root, 'errors'))
  await writeFile(join(root, 'errors/bad.scss'), badScss)
  await writeFile(join(root, 'errors/unused.js'), 'const unused = 1;\n')

  // `npm test` adds this already; running `node --test` directly does not.
  process.env.PATH = `${join(repo, 'node_modules/.bin')}:${originalPath}`
  process.chdir(root)
})

after(async () => {
  process.chdir(originalCwd)
  process.env.PATH = originalPath
  await rm(root, { recursive: true, force: true })
})

beforeEach((t) => {
  t.mock.method(console, 'log', () => {})
  t.mock.method(console, 'error', () => {})
  process.exitCode = 0
})

afterEach(() => {
  // Don't let a deliberate lint failure fail the test run itself.
  process.exitCode = 0
})

test('lint passes clean files and ignores 1_pattern_lab directories', async () => {
  await lint({})

  assert.equal(process.exitCode, 0)
})

test('lint fails when eslint finds errors', async () => {
  await lint({ js: true, jsFiles: 'errors/*.js' })

  assert.equal(process.exitCode, 2)
})

test('lint fails when stylelint finds errors', async () => {
  await lint({ css: true, cssFiles: 'errors/*.scss' })

  assert.equal(process.exitCode, 2)
})

test('lint --css skips JavaScript', async () => {
  await lint({ css: true, jsFiles: 'errors/*.js' })

  assert.equal(process.exitCode, 0)
})

test('lint --fix rewrites prettier formatting', async () => {
  await mkdir('fix')
  await writeFile('fix/messy.js', 'export const greeting = "hi"\n')

  await lint({ js: true, fix: true, jsFiles: 'fix/*.js' })

  assert.equal(await readFile('fix/messy.js', 'utf8'), "export const greeting = 'hi';\n")
  assert.equal(process.exitCode, 0)
})
