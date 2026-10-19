import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { packageInfo } from '../lib/helpers.js'

const repoRoot = join(import.meta.dirname, '..')

const runCli = (args) => spawnSync('node', ['bin/index.js', ...args], {
  cwd: repoRoot,
  encoding: 'utf8',
})

test('--help lists every command', () => {
  const result = runCli(['--help'])

  assert.equal(result.status, 0)
  for (const command of ['init', 'build', 'dev', 'lint', 'patternlab', 'sync', 'newsite']) {
    assert.match(result.stdout, new RegExp(`^\\s+${command}`, 'm'), `help output should list "${command}"`)
  }
})

test('--version prints the package version', () => {
  const result = runCli(['--version'])

  assert.equal(result.status, 0)
  assert.equal(result.stdout.trim(), `ucd-theme-tasks ${packageInfo().version}`)
})
