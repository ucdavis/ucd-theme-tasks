import { access, cp, rm } from 'fs/promises'
import { appendSlash } from './helpers.js'

/**
 * Resolve the source and destination paths for each synced asset type.
 *
 * Defaults to an Export into the destination theme. When a src is set this
 * is an Import and the current project is the destination.
 *
 * @param {object} config
 * @param {object} options
 * @return {object}
 */
export function resolveSyncPaths (config, options) {
  // Append trailing slashes if they are not present.
  const dest = appendSlash(options.dest || config.themeSync.dest)
  const src = appendSlash(options.src || config.themeSync.src)

  const srcBase = src || ''
  const destBase = src ? '' : dest

  return {
    sassSrc: srcBase + appendSlash(config.themeSync.sassSrc),
    sassDest: destBase + appendSlash(config.themeSync.sassDest),
    jsSrc: srcBase + appendSlash(config.themeSync.jsSrc),
    jsDest: destBase + appendSlash(config.themeSync.jsDest),
    imagesSrc: srcBase + appendSlash(config.themeSync.imagesSrc),
    imagesDest: destBase + appendSlash(config.themeSync.imagesDest),
    fontSrc: srcBase + appendSlash(config.themeSync.fontSrc),
    fontDest: destBase + appendSlash(config.themeSync.fontDest),
  }
}

export default async function sync (config, options) {
  const paths = resolveSyncPaths(config, options)

  // Delete and replace the Sass directory.
  if (config.themeSync.sassSync) {
    await waitForDirectory(paths.sassSrc)
    await rm(paths.sassDest, { recursive: true, force: true })
    await cp(paths.sassSrc, paths.sassDest, { recursive: true, force: true }).catch((error) => {
      console.error('Sass directory Copy failed: ' + error)
    })
  }

  // Delete and replace the Js directory.
  if (config.themeSync.jsSync) {
    await waitForDirectory(paths.jsSrc)
    await rm(paths.jsDest, { recursive: true, force: true })
    await cp(paths.jsSrc, paths.jsDest, { recursive: true, force: true }).catch((error) => {
      console.error('Js directory Copy failed: ' + error)
    })
  }

  // Copy Images directory (but don't delete the directory first).
  if (config.themeSync.imagesSync) {
    await waitForDirectory(paths.imagesSrc)
    await cp(paths.imagesSrc, paths.imagesDest, {
      recursive: true,
      force: true,
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
    await waitForDirectory(paths.fontSrc)
    await cp(paths.fontSrc, paths.fontDest, { recursive: true, force: true }).catch((error) => {
      console.error('Fonts directory Copy failed: ' + error)
    })
  }
}

async function directoryExists (dir) {
  try {
    await access(dir)
    return true
  } catch {
    return false
  }
}

async function waitForDirectory (dir) {
  const timeout = 30000 // 30 seconds
  const start = Date.now()

  while (!(await directoryExists(dir))) {
    if (Date.now() - start >= timeout) {
      throw new Error(`Timeout: Directory ${dir} not found within 30 seconds`)
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
