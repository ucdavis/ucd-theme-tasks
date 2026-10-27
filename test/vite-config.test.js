import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const repoRoot = join(import.meta.dirname, '..')
const projectDir = join(import.meta.dirname, 'fixtures/vite/project')

test('url() in a nested Sass partial resolves relative to the entry stylesheet', (t) => {
  const outDir = mkdtempSync(join(tmpdir(), 'ucd-theme-tasks-vite-'))
  t.after(() => rmSync(outDir, { recursive: true, force: true }))

  const result = spawnSync(join(repoRoot, 'node_modules/.bin/vite'), [
    'build',
    '--config', join(repoRoot, 'vite.config.mjs'),
    '--outDir', outDir,
    '--emptyOutDir',
    '--assetsInlineLimit', '0',
  ], { cwd: projectDir, encoding: 'utf8' })

  assert.equal(result.status, 0, result.stderr)
  assert.doesNotMatch(result.stdout + result.stderr, /didn't resolve at build time/)

  const css = readFileSync(join(outDir, 'style.css'), 'utf8')
  assert.match(css, /url\(["']?\.\/card\.png["']?\)|url\(["']?card\.png["']?\)/)
  assert.ok(readFileSync(join(outDir, 'card.png')))
})
