const { spawnSync } = require('child_process')

module.exports = function build (options) {

  // Pattern Lab build.
  if (options.patternlab) {
    spawnSync('ucd-theme-tasks', ['patternlab'], { stdio: 'inherit' })
  }

  // Snowpack build.
  spawnSync('snowpack', ['build'], { stdio: 'inherit' })

  // Autoprefixer.
  const files = options.prefixFiles || '{build,dist}/**/*.css'
  spawnSync('postcss', [files, '--use', 'autoprefixer', '--replace', '--no-map'], { stdio: 'inherit' })

}
