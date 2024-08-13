import { spawn, spawnSync } from 'child_process'
import { appendSlash } from './helpers.js'

export default function dev (parentPath, options, extraOptions) {

  const projectPath = appendSlash(parentPath)

  // Pattern Lab build.
  if (options.patternlab) {
    spawnSync('ucd-theme-tasks', ['patternlab'], { stdio: 'inherit' })

    // Watch for changes
    spawn('ucd-theme-tasks', ['patternlab', '--watch'], { stdio: 'inherit' })
  }

  let args = [];

  // Use vite build --watch if not starting a server.
  if (!options.serve) {
    args = ['build', '--watch']
  }

  // Add in any additional vite arguments passed to the command.
  if (extraOptions.args.length > 0) {
    args = [...args, ...extraOptions.args];
  }

  spawn('vite', args, { stdio: 'inherit' })

}
