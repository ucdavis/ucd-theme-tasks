import { spawnSync } from 'child_process'

/**
 * Run a command synchronously and return its exit status.
 *
 * @param {string} command
 * @param {array} args
 * @return {number}
 */
function run (command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })

  if (result.error) {
    console.error(`Failed to run "${command}": ${result.error.message}`)
    return 1
  }

  // A null status means the process was killed by a signal.
  return result.status ?? 1
}

export default function build (options, extraOptions) {

  // Pattern Lab build.
  if (options.patternlab) {
    const patternlabStatus = run('ucd-theme-tasks', ['patternlab', '--prod'])

    if (patternlabStatus !== 0) {
      process.exitCode = patternlabStatus
      return
    }
  }

  // Vite build.
  let args = ['build'];
  // Add in any additional vite arguments passed to the command.
  if (extraOptions.args.length > 0) {
    args = [...args, ...extraOptions.args];
  }

  const viteStatus = run('vite', args)

  // Skip autoprefixing if the build failed.
  if (viteStatus !== 0) {
    process.exitCode = viteStatus
    return
  }

  // Autoprefixer.
  const files = options.prefixFiles || '{build,dist}/**/*.css'
  const postcssStatus = run('postcss', [files, '--use', 'autoprefixer', '--replace', '--no-map'])

  if (postcssStatus !== 0) {
    process.exitCode = postcssStatus
  }

}
