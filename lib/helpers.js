import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'

/**
 * Append a slash to the end of a URL if it doesn't already have one.
 *
 * @param {string} url
 * @return {string}
 */
export function appendSlash(url) {
  if (!url) {
    return url
  }

  url += url.endsWith('/') ? '' : '/'
  return url
}

/**
 * Get the package.json data for the ucd-theme-tasks package.
 *
 * @return {object}
 */
export function packageInfo() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const packageJsonPath = join(__dirname, '../package.json')
  const packageJsonContent = readFileSync(packageJsonPath, 'utf8')
  return JSON.parse(packageJsonContent)
}
