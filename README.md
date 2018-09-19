# ucd-theme-tasks
Base automation for compiling a UCD frontend.

This package contains all of the gulp tasks needed by UCD frontend projects and
themes.

## Installation
1. Require the ucd-theme-tasks package with node.js.
```
$ npm install ucd-theme-tasks --save-dev
```

2. Create a `gulp-config.js` file which will contain any configuration overrides.
You can copy the default config out of this package to see all default config.
```
$ cp node_modules/ucd-theme-tasks/gulp-config.default.js gulp-config.js
```

3. Create a `gulpfile.js` in the root of your project.

```js
'use strict';
const gulp = require('gulp');
const config = require('./gulp-config.js');

// Load all default tasks.
require('ucd-theme-tasks')(gulp, config);
```

4. (Optional) Allow specific local config overrides of config.

```js
'use strict';
const gulp = require('gulp');
const _ = require('lodash');
let config = require('./gulp-config');

// Load in custom config
try {
  const customConfig = require('./gulp-config.local');
  config = _.merge(config, customConfig);
}
catch (e) {
  console.log('Add a gulp-config.local.js file for any custom local configuration.');
}

// Load all default tasks.
require('ucd-theme-tasks')(gulp, config);

```

## Validation and Linting
### JavaScript Linting
Linting of JavaScript is done via [EsLint](https://eslint.org/). Place a
`.eslintrc.yml` configuration file into the root of your project to set up the
linting rules. A starting file can be copied from this project.

```
$ cp node_modules/ucd-theme-tasks/.eslintrc.yml .eslintrc.yml
```

### Sass/Scss Linting
Linting of Sass/Scss files is done via
[Sass Lint](https://github.com/sasstools/sass-lint) Place a
`.sass-lint.yml` configuration file into the root of your project to set up the
linting rules. A starting file can be copied from this project.

```
$ cp node_modules/ucd-theme-tasks/.sass-lint.yml .sass-lint.yml
```

## Gulp Tasks
### Get Help
`gulp help` - The quickest way to see what each task does is to run `gulp help`. This will
list out each of the tasks with a description of what it does.

There are several gulp tasks which can be run individually, however it is often
easier to run one of the primary tasks which will start smaller tasks
automatically.

### Primary Tasks
1. `gulp` - Generate the production code and start watching for changes.

2. `gulp compile` - Generate all production-ready code.

3. `gulp validate` - Validate CSS and JS by linting (don't forget to set up
`.eslintrc.yml` and `.sass-lint.yml` files).

### Site Building Tasks
1. `gulp newsite` - Start a new site from a starterkit (used with Pattern Lab).

2. `gulp themesync` - Export/Import Pattern Lab source files to a website theme.

## Babel Compiling
[Babel](https://babeljs.io/) is used to transform es6 JavaScript into es5 usable
by older browsers. The [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
is used by default and can be customized in a `.babelrc` file placed into the
root of your project.

## Default Configuration
`gulp-config.default.js` contains all of the default configuration for
controlling the gulp tasks. This file can be referenced for all possible config
options. Docs can be found at [https://github.com/ucdavis/ucd-theme-tasks/blob/master/docs/config.md](https://github.com/ucdavis/ucd-theme-tasks/blob/master/docs/config.md)
