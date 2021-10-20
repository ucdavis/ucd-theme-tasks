const { spawnSync } = require('child_process')
const fs = require('fs');
const appendSlash = require('./helpers')

module.exports = async function dev (parentPath, options) {

  const projectPath = appendSlash(parentPath)

  // Pattern Lab build.
  if (options.patternlab) {
    spawnSync('ucd-theme-tasks', ['patternlab'], { stdio: 'inherit' })

    // Vite will need the `public/index.html` file copied to the root.
    await fs.copyFile(`${projectPath}public/index.html`, `${projectPath}index.html`, (err) => {
      if (err) throw err;
    });
  }

  let args = [];

  // Use vite build --watch if not starting a server.
  if (!options.serve) {
    args = ['build', '--watch']
  }

  spawnSync('vite', args, { stdio: 'inherit' })

}
