import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join } from 'node:path'
import { packageInfo } from '../lib/helpers.js'

const repoRoot = join(import.meta.dirname, '..')

const runCli = (args, env = process.env) => spawnSync('node', ['bin/index.js', ...args], {
  cwd: repoRoot,
  encoding: 'utf8',
  env,
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

// Stub the vite binary to record its arguments instead of running.
const withStubBins = (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'ucd-theme-tasks-bin-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))

  for (const bin of ['vite']) {
    const file = join(dir, bin)
    writeFileSync(file, `#!/bin/sh\nprintf '%s\\n' "$@" > "${join(dir, `${bin}.args`)}"\n`)
    chmodSync(file, 0o755)
  }

  const env = { ...process.env, PATH: `${dir}${delimiter}${process.env.PATH}` }
  const argsOf = (bin) => readFileSync(join(dir, `${bin}.args`), 'utf8').trim().split('\n')

  return { env, argsOf }
}

test('dev passes --host and other unknown arguments through to vite', (t) => {
  const { env, argsOf } = withStubBins(t)
  const result = runCli(['dev', '--host', '0.0.0.0', '--port', '3000'], env)

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(argsOf('vite'), ['--host', '0.0.0.0', '--port', '3000'])
})

test('dev --no-serve passes extra arguments after build --watch', (t) => {
  const { env, argsOf } = withStubBins(t)
  const result = runCli(['dev', '--no-serve', '--mode', 'development'], env)

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(argsOf('vite'), ['build', '--watch', '--mode', 'development'])
})

test('build passes unknown arguments through to vite', (t) => {
  const { env, argsOf } = withStubBins(t)
  const result = runCli(['build', '--outDir', 'out', '--minify', 'false'], env)

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(argsOf('vite'), ['build', '--outDir', 'out', '--minify', 'false'])
})
