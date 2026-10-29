import { readFile } from 'node:fs/promises'
import { relative, resolve, sep } from 'node:path'

const contentTypes = {
  '.html': 'text/html',
  '.json': 'application/json',
}

/**
 * Run Pattern Lab inside Vite.
 *
 * Vite's root stays the project so Sass and JS are served and watched from
 * their real source location. Pattern Lab's public/ output is only used as
 * Vite's publicDir for HTML and static assets.
 *
 * @return {import('vite').Plugin}
 */
export default function patternlab () {
  let pl
  let publicRoot
  let patternsDir

  return {
    name: 'ucd-theme-tasks:patternlab',
    apply: (_config, env) => !env.isPreview,

    async config (_config, { command }) {
      const { createPatternLab } = await import('./patternlab.js')
      pl = createPatternLab({ prod: command === 'build' })
      publicRoot = resolve(pl.plConfig.paths.public.root)
      patternsDir = resolve(pl.plConfig.paths.public.patterns)

      // Build before Vite indexes publicDir (dev) or copies it (build).
      await pl.build()

      return {
        publicDir: publicRoot,
        server: {
          watch: {
            // Pattern output is served below and reloaded once per rebuild, so
            // skip Vite's per-file events for hundreds of rewritten files.
            ignored: [(file) => file.startsWith(patternsDir + sep)],
          },
        },
      }
    },

    configureServer (server) {
      server.watcher.on('all', async (event, file) => {
        if (!['add', 'change', 'unlink'].includes(event)) return
        try {
          if (await pl.rebuild(file, event)) {
            server.ws.send({ type: 'full-reload', path: '*' })
          }
        } catch (e) {
          server.config.logger.error(e.stack ?? String(e))
        }
      })

      const patternsUrl = `/${relative(publicRoot, patternsDir).split(sep).join('/')}/`

      server.middlewares.use(async (req, res, next) => {
        const { pathname: rawPath, search } = new URL(req.url, 'http://localhost')
        let pathname
        try {
          pathname = decodeURIComponent(rawPath)
        } catch {
          return next()
        }

        if (pathname === '/') {
          req.url = `/index.html${search}`
          return next()
        }

        // Ignored by the watcher, so Vite's publicDir index misses new patterns.
        if (!pathname.startsWith(patternsUrl)) return next()
        const file = resolve(publicRoot, `.${pathname}`)
        if (!file.startsWith(patternsDir + sep)) return next()

        let body
        try {
          body = await readFile(file, 'utf8')
        } catch {
          return next()
        }

        const ext = pathname.slice(pathname.lastIndexOf('.'))
        // Rendered pages need the Vite client for HMR; markup-only is shown as
        // code. A full transformIndexHtml would rewrite Pattern Lab's inline
        // module scripts that import public/styleguide files.
        if (ext === '.html' && !pathname.endsWith('.markup-only.html')) {
          body = body.replace(/<head[^>]*>/i, `$&<script type="module" src="${server.config.base}@vite/client"></script>`)
        }

        res.setHeader('Content-Type', `${contentTypes[ext] ?? 'text/plain'}; charset=utf-8`)
        res.setHeader('Cache-Control', 'no-cache')
        res.end(body)
      })
    },
  }
}
