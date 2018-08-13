# ucd-theme-tasks
Base automation for compiling a UCD frontend.

This package contains all of the gulp tasks needed by UCD frontend projects and
themes.

# Installation
1. Require the ucd-theme-tasks package with node.js.
```
$ npm install ucd-theme-tasks --save-dev
```

2. Create a `gulp-config.js` file which will contain any configuration overrides.
You can copy the default config out of this package to see all default config.
```
$ cp node_modules/ucd-theme-tasks/config.default.js gulp-config.js
```

3. Create a `gulpfile.js` in the root of your project.

```js
'use strict';
var gulp = require('gulp');
var config = require('./gulp-config.js');

// Load all default tasks.
require('ucd-theme-tasks')(gulp, config);
```
