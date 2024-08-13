#!/usr/bin/env node
import _ from 'lodash'
import { program } from 'commander'
import defaultConfig from '../tasks-config.default.js'
import init from '../lib/init.js'
import build from '../lib/build.js'
import dev from '../lib/dev.js'
import lint from '../lib/lint.js'
import patternlab from '../lib/patternlab.js'
import sync from '../lib/sync.js'
import newsite from '../lib/newsite.js'
import settings from '../package.json' assert { type: 'json' };
let config = defaultConfig
let projectConfig = false
let configMessage = ''
const version = settings.version

// Get the path or the project using this command.
const parentNodePath = process.argv[1].replace('.bin/ucd-theme-tasks', '')
const parentPath = parentNodePath.replace('/node_modules', '')

// Load in Project specific config.
try {
  projectConfig = await import(`${parentPath}tasks-config`)
  config = _.merge(config, projectConfig)
} catch (e) {
  configMessage = 'Add a tasks-config.js file for any project specific configuration.'
}

// Load in custom local config.
try {
  const customConfig = await import(`${parentPath}tasks-config.local`)
  config = _.merge(config, customConfig)
}
catch (e) {
  // Only add the option for a local config if a project config is already used.
  if (projectConfig) {
    configMessage = 'Add a tasks-config.local.js file for any custom local configuration.'
  }
}

program.enablePositionalOptions()

program
  .version(`ucd-theme-tasks ${version}`)
  .usage('<command> [options]')

// Init.
program
  .command('init')
  .description('Copy starter files to a theme or custom site.')
  .option('-d, --dest <path>', 'Path to the theme directory or new site to export files into.')
  .option('-p, --patternlab', 'Use this inside Pattern Lab.')
  .option('-t, --themesync', 'Allow syncing with Pattern Lab.')
  .option('-f, --force', 'Force overwrite of existing files in theme.')
  .action((options) => {
    init(parentPath, options)
  })

// Build.
program
  .command('build')
  .description('Build all assets using Vite.')
  .option('-a, --prefix-files <glob>', 'CSS glob pattern [file|dir|glob]* to autoprefix css files.')
  .option('-p, --patternlab', 'Run the pattern lab build step before this build.')
  .passThroughOptions()
  .allowUnknownOption()
  .action((options, extraOptions) => {
    build(options, extraOptions)
  })

// Dev.
program
  .command('dev')
  .description('Development mode to build and watch all assets using Vite.')
  .option('-p, --patternlab', 'Run the pattern lab build step before this build.')
  .option('-S, --no-serve', 'Do not serve the files at a localhost domain. This is useful for when compiling inside a traditional CMS or site already using Docker to serve files.')
  .passThroughOptions()
  .allowUnknownOption()
  .action((options, extraOptions) => {
    dev(parentPath, options, extraOptions)
  })

// Lint.
program
  .command('lint')
  .description('Validate CSS and JS by linting.')
  .option('-f, --fix', 'Fix lint errors.')
  .option('-c, --css', 'Only lint SASS files.')
  .option('-C, --css-files <glob>', 'SASS glob pattern [file|dir|glob]* to search for files.')
  .option('-j, --js', 'Only lint Javascript files.')
  .option('-J, --js-files <glob>', 'Javascript glob pattern [file|dir|glob]* to search for files.')
  .action((options) => {
    lint(options)
  })

// Pattern Lab.
program
  .command('patternlab')
  .description('Compile Pattern Lab.')
  .option('-w, --watch', 'Watch for changes and rebuild.')
  .option('-p, --prod', 'Create a production build.')
  .action((options) => {
    patternlab(parentNodePath, options)
  })

// Theme Sync.
program
  .command('sync')
  .description('Sync asset files like js, css, fonts, and images to a site.')
  .option('-d, --dest <path>', 'Path to the theme directory or new site to export files into.')
  .option('-s, --src <path>', 'Path to the source from which files will be imported.')
  .action((options) => {
    sync(config, options)
  })

// Init.
program
  .command('newsite')
  .description('Wire up a new site to allow syncing files from an existing project using its starterkit. This assumes the command is being run within a project that has a "starterkit" directory.')
  .option('-d, --dest <path>', 'Path to the theme directory or new site to export files into.')
  .option('-f, --force', 'Force overwrite of existing files in theme.')
  .action((options) => {
    newsite(config, options)
  })

// Add some useful info on help.
program.on('--help', () => {
  console.log()
  console.log('Run "ucd-theme-tasks <command> --help" for detailed usage of given command.')
  console.log()
  console.log(configMessage)
})

program.parse(process.argv)
