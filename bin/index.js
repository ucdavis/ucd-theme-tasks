#!/usr/bin/env node
const _ = require('lodash');
const program = require('commander')
const defaultConfig = require('../gulp-config.default');


// console.log("Hello, here is my first CLI tool")

// get args
// console.log(process.argv);

// console.log(defaultConfig)

program
  .version(`ucd-theme-tasks ${require('../package').version}`)
  .usage('<command> [options]')

program
  .command('patternlab')
  .description('Compile Pattern Lab')
  .option('-w, --watch', 'watch for changes and rebuild')
  .allowUnknownOption()
  .action((options) => {
    require('../lib/patternlab')(process.argv[1], options)
  })

program.parse(process.argv)