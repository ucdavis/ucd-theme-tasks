# Upgrading from v3

Version 4 is a complete rewrite away from using Gulp/Webpack for compiling
assets and now uses [Snowpack](https://www.snowpack.dev/) as the main compiling
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

| v3                         | v4                    |
| -------------------------- |:---------------------:|
| .babelrc                   | *removed*             |
| .eslintrc.yml              | *updated*             |
| .gitignore                 | *updated*             |
| .sass-lint.yml             | .stylelintrc.yml      |
| gulp-config.(js/yml)       | tasks-config.js       |
| gulp-config.local.(js/yml) | tasks-config.local.js |
| *not in v3*                | snowpack.config.js    |

### Gulp Config
Gulp is no longer used. All build config is done via the `snowpack.config.js`
file. Specific snowpack config can be found at https://www.snowpack.dev/reference/configuration

`tasks-config.js` replaces the `gulp-config.yml` but only for when needing to
configure sync settings from one project to another. This file can be ignored
if syncing is not used. All other config should be a part of
`snowpack.config.js`.

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

> *WARNING*: Any `@import` in sass files will cause errors with snowpack. Only
> `@use` will be supported.

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
