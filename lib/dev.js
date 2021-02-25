const { spawnSync } = require('child_process')

module.exports = function dev (config, options) {

  // Pattern Lab build.
  if (options.patternlab) {
    spawnSync('ucd-theme-tasks', ['patternlab'], { stdio: 'inherit' })
  }

  // Snowpack build.
  spawnSync('snowpack', ['dev'], { stdio: 'inherit' })

}
