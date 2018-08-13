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
const gulp = require('gulp');
const config = require('./gulp-config.js');

// Load all default tasks.
require('ucd-theme-tasks')(gulp, config);
```

4. (Optional) Allow specific local config overrides of config.

```js
'use strict';

const _ = require('lodash');
const gulp = require('gulp');
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
