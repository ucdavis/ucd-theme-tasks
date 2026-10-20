import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appendSlash } from '../lib/helpers.js'

test('appendSlash adds a trailing slash', () => {
  assert.equal(appendSlash('path/to/theme'), 'path/to/theme/')
})

test('appendSlash keeps an existing trailing slash', () => {
  assert.equal(appendSlash('path/to/theme/'), 'path/to/theme/')
})

test('appendSlash returns falsy values unchanged', () => {
  assert.equal(appendSlash(''), '')
  assert.equal(appendSlash(false), false)
  assert.equal(appendSlash(undefined), undefined)
})
