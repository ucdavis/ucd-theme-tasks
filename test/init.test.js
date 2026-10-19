import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import init from '../lib/init.js'

let dest

beforeEach(async () => {
  dest = await mkdtemp(join(tmpdir(), 'ucd-init-'))
})

afterEach(async () => {
  await rm(dest, { recursive: true, force: true })
})

test('init copies the starter files but not tasks-config.js', async () => {
  await init(dest, { dest })

  assert.ok(existsSync(join(dest, 'vite.config.mjs')))
  assert.ok(existsSync(join(dest, '.stylelintrc.yml')))
  assert.ok(existsSync(join(dest, 'eslint.config.mjs')))
  assert.ok(existsSync(join(dest, 'prettier.config.mjs')))
  assert.ok(!existsSync(join(dest, 'tasks-config.js')), 'tasks-config.js is only for themesync/patternlab setups')
})

test('init includes tasks-config.js with the --themesync flag', async () => {
  await init(dest, { dest, themesync: true })

  assert.ok(existsSync(join(dest, 'tasks-config.js')))
})

test('init includes tasks-config.js with the --patternlab flag', async () => {
  await init(dest, { dest, patternlab: true })

  assert.ok(existsSync(join(dest, 'tasks-config.js')))
})

test('init keeps existing files unless --force is used', async () => {
  const existing = join(dest, 'vite.config.mjs')
  await writeFile(existing, '// custom project config')

  await init(dest, { dest })
  assert.equal(await readFile(existing, 'utf8'), '// custom project config')

  await init(dest, { dest, force: true })
  assert.notEqual(await readFile(existing, 'utf8'), '// custom project config')
})
