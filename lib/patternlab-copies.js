import { createRequire } from 'node:module'

// Pattern Lab starts its asset copies without awaiting them, so build()
// resolves while files are still being written. Wrap the copy module it uses
// (before Pattern Lab loads it) so callers can wait for those copies.
const plRequire = createRequire(createRequire(import.meta.url).resolve('@pattern-lab/core/src/lib/copyFile.js'))
const copyPath = plRequire.resolve('recursive-copy')
const copy = plRequire('recursive-copy')
const pending = new Set()

const trackedCopy = (...args) => {
  const operation = copy(...args)
  const done = Promise.resolve(operation).catch(() => {})
  pending.add(done)
  done.then(() => pending.delete(done))
  return operation
}
Object.assign(trackedCopy, copy)
plRequire.cache[copyPath].exports = trackedCopy

/**
 * Resolve once every asset copy Pattern Lab has started is finished.
 *
 * @return {Promise<void>}
 */
export async function copiesSettled () {
  while (pending.size) {
    await Promise.all(pending)
  }
}
