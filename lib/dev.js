const { spawnSync } = require('child_process')

module.exports = function dev (options) {

  // Pattern Lab build.
  if (options.patternlab) {
    spawnSync('ucd-theme-tasks', ['patternlab'], { stdio: 'inherit' })
  }

  let args = ['dev'];

  // Use snowpack build --watch if not starting a server.
  if (!options.serve) {
    args = ['build', '--watch']
  }

  spawnSync('snowpack', args, { stdio: 'inherit' })

}
