import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildStylelintCommand, buildPrettierCommand, buildEslintCommand } from '../lib/lint.js'

const defaultCssGlob = '{source/sass,src/sass,sass,source/scss,src/scss,scss}/**/*.scss'
const defaultJsGlob = '{source/js,src/js,js}/**/*{.js,.mjs,.ts}'

test('stylelint command uses the default glob, ignore pattern, and color', () => {
  assert.equal(
    buildStylelintCommand({}),
    `stylelint "${defaultCssGlob}" --ignore-pattern "**/1_pattern_lab/*" --color`
  )
})

test('stylelint command supports --fix and a custom glob', () => {
  assert.equal(
    buildStylelintCommand({ fix: true, cssFiles: 'styles/**/*.scss' }),
    'stylelint "styles/**/*.scss" --ignore-pattern "**/1_pattern_lab/*" --fix --color'
  )
})

test('prettier command checks by default and excludes Pattern Lab imports', () => {
  assert.equal(
    buildPrettierCommand({}),
    `prettier --check "${defaultJsGlob}" "!**/1_pattern_lab/**"`
  )
})

test('prettier command writes when fixing', () => {
  assert.equal(
    buildPrettierCommand({ fix: true, jsFiles: 'scripts/**/*.js' }),
    'prettier --write "scripts/**/*.js" "!**/1_pattern_lab/**"'
  )
})

test('eslint command uses the default glob, ignore pattern, and color', () => {
  assert.equal(
    buildEslintCommand({}),
    `eslint "${defaultJsGlob}" --ignore-pattern "**/1_pattern_lab/*" --color`
  )
})

test('eslint command supports --fix and a custom glob', () => {
  assert.equal(
    buildEslintCommand({ fix: true, jsFiles: 'scripts/**/*.js' }),
    'eslint "scripts/**/*.js" --ignore-pattern "**/1_pattern_lab/*" --fix --color'
  )
})
