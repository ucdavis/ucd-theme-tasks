# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`ucd-theme-tasks` is an npm package published by UC Davis that provides a CLI
(`bin/index.js`, exposed as `ucd-theme-tasks`) wrapping frontend tooling for
SiteFarm projects. It is installed as a devDependency inside *other* projects —
Pattern Lab instances, the Drupal SiteFarm distribution's themes, and
subthemes — and is never run standalone. It is built on Vite but deliberately
does not assume Vite's default file layout: it must work in Pattern Lab and
with the Drupal Vite module, where assets live deep inside a theme directory
and Drupal (not Vite) serves the pages.

The package ships as plain ESM with no build step and no test suite. There are
no npm scripts in package.json. To try changes, run the CLI from inside a
consuming project (e.g. via `npm link` or a local install); `node bin/index.js`
run directly from this repo will not resolve undeclared imports (see below).

Requires Node >= 22.17.0 (`.nvmrc`). `"type": "module"` — everything is ESM.

## Architecture

**CLI entry (`bin/index.js`)**: Commander-based. Each command lazy-imports its
implementation from `lib/` (one module per command: `init`, `build`, `dev`,
`lint`, `patternlab`, `sync`, `newsite`). It locates the consuming project by
stripping `node_modules/.bin/ucd-theme-tasks` off `process.argv[1]`, then
merges config in three layers with lodash `merge`:
`tasks-config.default.mjs` (this package) ← the project's `tasks-config.js` ←
the project's `tasks-config.local.js`.

**Tasks shell out, they don't use APIs**: `lib/build.js` and `lib/dev.js`
spawn the `vite` and `postcss` CLI binaries rather than calling Vite's JS API.
Both commands use Commander's `passThroughOptions()`/`allowUnknownOption()` so
unrecognized flags are forwarded to Vite verbatim. `build` runs autoprefixer
over `{build,dist}/**/*.css` afterward. `dev --no-serve` switches to
`vite build --watch` for CMS/Docker setups where Drupal serves the files.
`lib/lint.js` shells out to `stylelint` (scss) and `prettier --check` +
`eslint` (js), with `--fix` rewriting the prettier command to `--write`.

**Shared Vite config (`vite.config.mjs` at package root)**: consumers
re-export it (`export { default } from 'ucd-theme-tasks/vite.config.mjs'`, see
`starter/vite.config.mjs`) or extend it with `mergeConfig`. Its non-default
choices exist for the Drupal/CMS use case — change them carefully:
- Entry points are globbed from top-level `js/*.js` and `sass/*.scss` in the
  consuming project (Sass partials and `js/jquery.module.js` excluded), not an
  index.html.
- `base: './'` forces relative asset paths because output lives deep inside a
  Drupal theme, not at web root.
- `build.manifest: true` and hash-free `entryFileNames`/`assetFileNames`
  because the Drupal Vite module reads the manifest and Drupal handles cache
  busting.
- `jquery` is aliased to the project's local `js/jquery.module.js`.
- `vite-plugin-full-reload` watches `*.php|inc|theme|twig` so template edits
  reload the browser.
- Dev server pins `origin: 'http://localhost:5173'` and enables CORS so a
  CMS page on another domain can load assets from the Vite server.

**Dependency resolution is unusual**: `vite` is a peerDependency, and several
modules import packages this repo does not declare at all — `fast-glob`
(vite.config.mjs), `fs-extra` (`lib/init.js`, `lib/newsite.js`), `chokidar`
and `@pattern-lab/core` (`lib/patternlab.js`). These resolve from the
consuming project's node_modules (Pattern Lab projects provide the latter
two). This is why the package only works installed inside a host project, and
why adding an import to `lib/` may need a corresponding dependency decision.

**Starter files (`starter/`)**: copied into a consuming project by
`init` (and `newsite`). The `*.default.*` files at the repo root
(`.stylelintrc.default.yml`, `eslint.config.default.mjs`,
`prettier.config.default.mjs`, `tasks-config.default.mjs`) are the shared
configs that the starter copies extend/re-export — keep the pairs in sync.

**Pattern Lab integration (`lib/patternlab.js`)**: optional and effectively
legacy — treat it as near-dead code. Pattern Lab lives outside Drupal, so
Drupal themes never touch this path, and the packages it drives
(`@pattern-lab/core` and friends) are dated. Pattern Lab's own watch/serve is
not used as designed — that is the whole reason this module exists: it
replaces Pattern Lab's native tooling with a custom flow that builds patterns
and pipes the output through Vite for serving/compiling. Mechanically, it
reads the host's `patternlab-config.json` and drives `@pattern-lab/core`; its
own chokidar watcher copies changed `.js`/`.scss` files from `source/` into
`public/` so Vite picks them up, and data/meta/annotation changes trigger a
full clean rebuild. Builds inject a `productionBuild` data flag for templates.
Avoid investing in this module beyond keeping it working.

**Theme sync (`lib/sync.js`, `lib/newsite.js`)**: copies sass/js/images/fonts
between a Pattern Lab project and a theme using the `themeSync` paths from
tasks-config (docs in `docs/config.md`). Direction flips on `themeSync.src`:
false = export to `dest`, a path = import from `src`. Sass and JS destination
directories are deleted and replaced; images and fonts are copied over
(`sample/` image directories excluded). Synced code lands in `1_pattern_lab/`
directories, which lint deliberately ignores.

## History / version context

v3 and earlier were Gulp-based, v4 was Snowpack, v5 is Vite. `docs/upgrade.md`
covers migrations; `docs/config.md` documents current `themeSync` options plus
the removed legacy options. The `dev/` directory is a leftover gulp-era
fixture, not part of the published package.
