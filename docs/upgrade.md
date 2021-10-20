# Upgrading from v4

Version 4 is similar but used [Snowpack](https://www.snowpack.dev/)
instead of [Vite](https://vitejs.dev/). Moving from 4 to 5 most likely only
requires adding a `vite.config.js` file and configuring it for you needs
https://vitejs.dev/config/.

# Upgrading from v3

Version 4/5 is a complete rewrite away from using Gulp/Webpack for compiling
assets and now uses [Vite](https://vitejs.dev/) as the main compiling
engine. This provides better standards and less custom code.

## Update to the latest UCD Theme Tasks version.
```
$ npm install ucd-theme-tasks@latest
```

You can try to automatically add all of the new files via command line with:
```
$ npx ucd-theme-tasks init --force
```

### Replaced/Renamed files
The following table maps the old file to the new ones in v4. Any new files can
be found in the `/starter` folder. If a file only needs to be updated. The file
can as well be copied out of the `/starter` directory.

| v3                         | v5                    |
| -------------------------- |:---------------------:|
| .babelrc                   | *removed*             |
| .eslintrc.yml              | *updated*             |
| .gitignore                 | *updated*             |
| .sass-lint.yml             | .stylelintrc.yml      |
| gulp-config.(js/yml)       | tasks-config.js       |
| gulp-config.local.(js/yml) | tasks-config.local.js |
| *not in v3*                | vite.config.js    |

### Gulp Config
Gulp is no longer used. All build config is done via the `vite.config.js`
file. Specific Vite config can be found at https://vitejs.dev/config/.

`tasks-config.js` replaces the `gulp-config.yml` but only for when needing to
configure sync settings from one project to another. This file can be ignored
if syncing is not used. All other config should be a part of
`vite.config.js`.

## CSS/SASS

### Importing from NPM packages
CSS from npm packages will no longer be automatically added so you will need to
explicitly import them.

Examples:
* Via Sass: `@use "slim-select/dist/slimselect.css";`
* Vis JS: `import 'slim-select/dist/slimselect.css';`

### Sass Globbing
Globbing (`@import "components/**/*`) is no longer allowed. Each Sass partial
needs to be added to the main stylesheet individually.

### Sass version and syntax
[Node Sass](https://www.npmjs.com/package/node-sass) has been replaced by
[Dart Sass](https://sass-lang.com/dart-sass). This means has created a lot of
deprecations to old syntax like `@import` being replaced by `@use`.

Migrating to the new syntax can be done automatically with [sass-migrator](https://sass-lang.com/blog/the-module-system-is-launched#automatic-migration)
```
$ npx sass-migrator module --migrate-deps <path/to/style.scss>
```

## Javascript
Javascript files need to be converted to standard standard
[ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
files using import/export.

Be sure to add `type="module"` to script tags so that browsers will understand
that ESM is being used.

```html
<script src="/dist/main.js" type="module"></script>
```





## SiteFarm subthemes
If using a SiteFarm subtheme, more direct upgrading documentation can be found
in this Google Doc.
https://docs.google.com/document/d/1GTfeZRB5y1g37oy2z0LJNxUxQeWXyYrPOTcvt_GDPow/edit?usp=sharing
