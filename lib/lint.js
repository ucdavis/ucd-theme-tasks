const { exec } = require('child_process')

module.exports = function lint (options) {

  const lint = (command) => {
    // Ignore imported Pattern Lab folders.
    command = command + ' --ignore-pattern "**/1_pattern_lab/*"'

    // Attempt to automatically fix errors.
    if (options.fix) {
      command = command + ' --fix'
    }

    // Always show console colors.
    command = command + ' --color'

    exec(command, (error, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)

      if (error) {
        process.exitCode = 2
      }
    })
  }

  const lintCss = () => {
    const files = options.cssFiles || '{source/sass,src/sass,sass,source/scss,src/scss,scss}/**/*.scss'

    const command = `stylelint "${files}"`
    lint(command)
  }

  const lintJs = () => {
    const files = options.jsFiles || '{source/js,src/js,js}/**/*{.js,.mjs,.ts}'

    let command = `eslint "${files}"`
    lint(command)
  }

  if (!options.js) {
    lintCss()
  }

  if (!options.css) {
    lintJs()
  }

}
