const copy = require('recursive-copy')
const appendSlash = require('./helpers')

module.exports = async function newsite (config, options) {
  let dest = options.dest || config.themeSync.dest
  // Append trailing slashes if they are not present.
  dest = appendSlash(dest)

  const copyOptions = {
    dot: true,
  }

  if (options.force) {
    copyOptions.overwrite = true
  }

  try {
    await copy('starterkit', dest, copyOptions)
  } catch (error) {
    console.error(`Starterkit Copy failed:
    
${error}`)

    if (error.code === 'EEXIST') {
      console.log(`
Use the --force flag to overwrite existing files.`)
    }

    return
  }

  console.info('Starterkit directory structure copied.')

  // Copy tasks files.
  copy(`${__dirname}/../starter/`, dest, copyOptions)
    .catch((error) => {
      // Fail silently if the files exist since they may have been part of the
      // starterkit.
      if (error.code !== 'EEXIST') {
        console.error(`Starter files Copy failed: ${error}`)
      }
    })

  // Copy Sass directory.
  copy(appendSlash(config.themeSync.sassSrc), dest + appendSlash(config.themeSync.sassDest), { overwrite: true })
    .catch((error) => {
      console.error(`Sass directory Copy failed: ${error}`)
    })

  // Copy JS directory.
  copy(appendSlash(config.themeSync.jsSrc), dest + appendSlash(config.themeSync.jsDest), { overwrite: true })
    .catch((error) => {
      console.error(`Js directory Copy failed: ${error}`)
    })

  // Copy Images directory.
  const imageOptions = {
    filter: ['**/*', '!sample/**/*', '!sample'],
  }

  if (options.force) {
    imageOptions.overwrite = true
  }

  copy(appendSlash(config.themeSync.imagesSrc), dest + appendSlash(config.themeSync.imagesDest), imageOptions)
    .catch((error) => {
      console.error(`Images directory Copy failed: ${error}`)
    })
}
