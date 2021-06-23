const copy = require('recursive-copy')
const appendSlash = require('./helpers')

module.exports = async function init (parentPath, options) {
  let dest = options.dest || parentPath
  // Append trailing slashes if they are not present.
  dest = appendSlash(dest)

  const copyOptions = {
    dot: true,
    filter: ['*', '!tasks-config.js'],
  }

  if (options.themesync || options.patternlab) {
    delete copyOptions.filter
  }

  if (options.force) {
    copyOptions.overwrite = true
  }

  // Copy root files.
  try {
    await copy(`${__dirname}/../starter/`, dest, copyOptions)
  } catch (error) {
    console.error(`Starter files Copy failed:

${error}`)

    if (error.code === 'EEXIST') {
      console.log(`
Use the --force flag to overwrite existing files.`)
    }

    if (error.code === 'ENOTDIR') {
      console.log(`
Run this from the directory within your node project or use the --dest flag to provide a path to where files should be copied to.`)
    }

    return
  }

  // Show package.json scripts that can be used.
  console.log(`
Add the following scripts into your package.json file:`)

  if (options.patternlab) {
    console.log(`
"scripts": {
  "start": "npm run dev",
  "dev": "ucd-theme-tasks dev --patternlab",
  "build": "ucd-theme-tasks build --patternlab",
  "pl:watch": "ucd-theme-tasks patternlab --watch",
  "pl:build": "ucd-theme-tasks patternlab",`)
  } else {
    console.log(`
"scripts": {
  "start": "npm run dev",
  "dev": "ucd-theme-tasks dev",
  "build": "ucd-theme-tasks build",`)
  }

  let syncScript = ''
  if (options.themesync || options.patternlab) {
    syncScript = `"themesync": "ucd-theme-tasks sync",
  `
  }

  console.log(`  ${syncScript}"lint": "ucd-theme-tasks lint",
  "lint:css": "ucd-theme-tasks lint --css",
  "lint:css-fix": "ucd-theme-tasks lint --css --fix",
  "lint:js": "ucd-theme-tasks lint --js",
  "lint:js-fix": "ucd-theme-tasks lint --js --fix"
}`)

}
