#!/usr/bin/env node
const _ = require('lodash')
const program = require('commander')
const defaultConfig = require('../tasks-config.default')
let config = defaultConfig

// Get the path or the project using this command.
const parentNodePath = process.argv[1].replace('.bin/ucd-theme-tasks', '')
const parentPath = parentNodePath.replace('/node_modules', '')

// Load in Pattern Lab config.
try {
  const userConfig = require(`${parentPath}tasks-config`)
  config = _.merge(defaultConfig, userConfig)
} catch (e) {
  console.log('Add a tasks-config.js file for any project specific configuration.')
}

program
  .version(`ucd-theme-tasks ${require('../package').version}`)
  .usage('<command> [options]')

program
  .command('patternlab')
  .description('Compile Pattern Lab')
  .option('-w, --watch', 'Watch for changes and rebuild.')
  .action((options) => {
    require('../lib/patternlab')(parentNodePath, options)
  })

program
  .command('sync')
  .description('Sync asset files like js, css, fonts, and images to a site.')
  .option('-d, --dest <path>', 'Path to the theme directory or new site to export files into.')
  .option('-s, --src <path>', 'Path to the source from which files will be imported.')
  .action((options) => {
    require('../lib/sync')(config, options)
  })

program
  .command('lint')
  .description('Validate CSS and JS by linting')
  .option('-f, --fix', 'Fix lint errors.')
  .option('-c, --css', 'Only lint SASS files.')
  .option('--cssFiles <glob>', 'SASS glob pattern [file|dir|glob]* to search for files.')
  .option('-j, --js', 'Only lint Javascript files.')
  .option('--jsFiles <glob>', 'Javascript glob pattern [file|dir|glob]* to search for files.')
  .action((options) => {
    require('../lib/lint')(config, options)
  })

program
  .command('build')
  .description('Build all assets using Snowpack.')
  .option('--prefixFiles <glob>', 'CSS glob pattern [file|dir|glob]* to autoprefix css files.')
  .option('-p, --patternlab', 'Run the pattern lab build step before this build.')
  .action((options) => {
    require('../lib/build')(config, options)
  })

program
  .command('dev')
  .description('Development mode to build and watch all assets using Snowpack.')
  .option('-p, --patternlab', 'Run the pattern lab build step before this build.')
  .action((options) => {
    require('../lib/dev')(config, options)
  })

program.parse(process.argv)
