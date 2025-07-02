import fs from 'fs'
import { promisify } from 'util'
import fsExtra from 'fs-extra'
import del from 'del'
import { appendSlash } from './helpers.js'

export default async function sync (config, options) {
  let dest = options.dest || config.themeSync.dest
  let src = options.src || config.themeSync.src

  // Append trailing slashes if they are not present.
  dest = appendSlash(dest)
  src = appendSlash(src)

  // Default to an Export.
  let sassSrc = appendSlash(config.themeSync.sassSrc)
  let sassDest = dest + appendSlash(config.themeSync.sassDest)
  let jsSrc = appendSlash(config.themeSync.jsSrc)
  let jsDest = dest + appendSlash(config.themeSync.jsDest)
  let imagesSrc = appendSlash(config.themeSync.imagesSrc)
  let imagesDest = dest + appendSlash(config.themeSync.imagesDest)
  let fontSrc = appendSlash(config.themeSync.fontSrc)
  let fontDest = dest + appendSlash(config.themeSync.fontDest)

  // If this is an Import.
  if (src) {
    sassSrc = src + appendSlash(config.themeSync.sassSrc)
    sassDest = appendSlash(config.themeSync.sassDest)
    jsSrc = src + appendSlash(config.themeSync.jsSrc)
    jsDest = appendSlash(config.themeSync.jsDest)
    imagesSrc = src + appendSlash(config.themeSync.imagesSrc)
    imagesDest = appendSlash(config.themeSync.imagesDest)
    fontSrc = src + appendSlash(config.themeSync.fontSrc)
    fontDest = appendSlash(config.themeSync.fontDest)
  }

  // Delete and replace the Sass directory.
  if (config.themeSync.sassSync) {
    await waitForDirectory(sassSrc)
    del(sassDest, { force: true }).then(() => {
      fsExtra.copy(sassSrc, sassDest, { overwrite: true }).catch((error) => {
        console.error('Sass directory Copy failed: ' + error)
      })
    })
  }

  // Delete and replace the Js directory.
  if (config.themeSync.jsSync) {
    await waitForDirectory(jsSrc)
    del(jsDest, { force: true }).then(() => {
      fsExtra.copy(jsSrc, jsDest, { overwrite: true }).catch((error) => {
        console.error('Sass directory Copy failed: ' + error)
      })
    })
  }

  // Copy Images directory (but don't delete the directory first).
  if (config.themeSync.imagesSync) {
    await waitForDirectory(imagesSrc)
    fsExtra.copy(imagesSrc, imagesDest, {
      overwrite: true,
      filter: (src) => {
        // Exclude sample directory and its contents
        return !/\/sample(\/|$)/.test(src)
      }
    }).catch((error) => {
      console.error('Images directory Copy failed: ' + error)
    })
  }

  // Copy the Fonts directory (but don't delete the directory first).
  if (config.themeSync.fontSync) {
    await waitForDirectory(fontSrc)
    fsExtra.copy(fontSrc, fontDest, {
      overwrite: true,
      filter: () => true
    }).catch((error) => {
      console.error('Fonts directory Copy failed: ' + error)
    })
  }
}

async function waitForDirectory(dir) {
  const exists = promisify(fs.exists)
  const timeout = 30000 // 30 seconds
  const start = Date.now()

  while (!(await exists(dir))) {
    if (Date.now() - start >= timeout) {
      throw new Error(`Timeout: Directory ${dir} not found within 30 seconds`)
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
