import { exec } from 'child_process'

// Imported Pattern Lab folders should not be linted.
const ignorePattern = '**/1_pattern_lab/*'

const defaultCssFiles = '{source/sass,src/sass,sass,source/scss,src/scss,scss}/**/*.scss'
const defaultJsFiles = '{source/js,src/js,js}/**/*{.js,.mjs,.ts}'

/**
 * Build the stylelint shell command.
 *
 * @param {object} options
 * @return {string}
 */
export function buildStylelintCommand (options) {
  const files = options.cssFiles || defaultCssFiles
  let command = `stylelint "${files}" --ignore-pattern "${ignorePattern}"`

  if (options.fix) {
    command += ' --fix'
  }

  return command + ' --color'
}

/**
 * Build the prettier shell command.
 *
 * @param {object} options
 * @return {string}
 */
export function buildPrettierCommand (options) {
  const files = options.jsFiles || defaultJsFiles
  const mode = options.fix ? '--write' : '--check'

  // Prettier has no --ignore-pattern flag, so exclude with a negated glob.
  return `prettier ${mode} "${files}" "!**/1_pattern_lab/**"`
}

/**
 * Build the eslint shell command.
 *
 * @param {object} options
 * @return {string}
 */
export function buildEslintCommand (options) {
  const files = options.jsFiles || defaultJsFiles
  let command = `eslint "${files}" --ignore-pattern "${ignorePattern}"`

  if (options.fix) {
    command += ' --fix'
  }

  return command + ' --color'
}

export default function lint (options) {

  const linter = (command) => new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)

      if (error) {
        process.exitCode = 2
      }

      resolve()
    })
  })

  const runs = []

  if (!options.js) {
    runs.push(linter(buildStylelintCommand(options)))
  }

  if (!options.css) {
    // Sequential so prettier --write and eslint --fix never rewrite the same file concurrently.
    runs.push(linter(buildPrettierCommand(options))
      .then(() => linter(buildEslintCommand(options))))
  }

  return Promise.all(runs)
}
