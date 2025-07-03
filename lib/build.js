import { spawnSync } from 'child_process'

export default function build (options, extraOptions) {

  // Pattern Lab build.
  if (options.patternlab) {
    spawnSync('ucd-theme-tasks', ['patternlab', '--prod'], { stdio: 'inherit' })
  }

  // Vite build.
  let args = ['build'];
  // Add in any additional vite arguments passed to the command.
  if (extraOptions.args.length > 0) {
    args = [...args, ...extraOptions.args];
  }

  spawnSync('vite', args, { stdio: 'inherit' })

  // Autoprefixer.
  const files = options.prefixFiles || '{build,dist}/**/*.css'
  spawnSync('postcss', [files, '--use', 'autoprefixer', '--replace', '--no-map'], { stdio: 'inherit' })

}
