## css

* _enabled_ - (Boolean) value that will enable or disable css related Gulp tasks.
* _src_ - (Array) The location of all files to compile from SCSS to CSS. Notice the use of asterisks in the source path, `sass/**/*.scss`. This path is using `gulp-sass-glob` to get all files ending in .scss from all folders in source/sass. You can also exclude files by prefixing with `!` such as `!sass/exclude.scss`
* _vendor_ - (Array) List of vendor CSS files to include in compilation.
* _dest_ - The location to place the compiled CSS.
* _flattenDestOutput_ - (Boolean) value for minification of compiled CSS.
* _lint_ - Validate code standards with `sass-lint`.
   * _enabled_ - (Boolean) to turn CSS code validation on or off.
   * _failOnError_ - (Boolean) to stop code from compiling if it does not validate.
   * _extraSrc_ - (Array) Add paths to files that you would like to be included in CSS validation. You may exclude files from this process by placing them here, but prefixing the path with an exclamation point. This is the boolean NOT operator also called negation.
* _sourceComments_ - (Boolean) to leave or strip comments from the compiled CSS code.
* _sourceMapEmbed_ - (Boolean) for adding CSS source maps for in browser SASS debugging.
* _outputStyle_ - Tell the compiler whether you want `expanded` or `compressed` output code.
* _autoPrefixerBrowsers_ - (Array) List browsers you would like vendor prefixes generated for. [https://github.com/ai/browserslist#queries](https://github.com/ai/browserslist#queries)
* _sassdoc_ - Settings for generated SASS documentation. [http://sassdoc.com](http://sassdoc.com)
    * _enabled_ - (Boolean) to generate SASS Docs.
    * _dest_ - Destination for SASS Documentation code.
    * _verbose_ - (Boolean) value to enable or disable verbose mode
    * _basePath_ - The SASS base path from the public repository. Notice in the config file this has a child element of "exclude" that you can use to exclude files from this base path.
    * _theme_ - Set the theme to be used to display the SASS Docs. We are using "default".
    * _sort_ - (Array) Set the sort order of the documentation. [http://sassdoc.com/customising-the-view/#sort](http://sassdoc.com/customising-the-view/#sort)

## js

* _enabled_ - (Boolean) value enabling or disabling js Gulp tasks
* _src_ - (Array) A list of locations to find JS files. Notice the use of the file globbing technique here. You can also exclude files by prefixing with `!` such as `!js/exclude.js`
* _dest_ - The destination for compiled JS file.
* _destName_ - The file name you would like used for the compiled JS file.
* _sourceMapEmbed_ - (Boolean) value to enable JS source maps.
* _uglify_ - (Boolean) value to minify destination JS file.
* _babel_ - (Boolean) enable or disable es6 to es5 compiling with [Babel](https://babeljs.io/)
* _preserveLicense_ - (Boolean) whether to preserve a license in a vendor package.
* _eslint_ - Settings related to JS validation.
    * _enabled_ - (Boolean) value to enable JS validation.
    * _failAfterError_ - (Boolean) value to allow js to compile if it doesn't validate.
    * _extraSrc_ - (Array) List of files to include or exclude from validation. This is useful for excluding code you didn't write, therefore have no authority to change to meet validation criteria.

## nodeFiles:

* _enabled_ - (Boolean) value for including NPM files.
* _dir_ - Path to NPM node modules file directory.
* _includePaths_ - (Array) List of npm directory paths to look for files such as `node_modules/singularitygs/stylesheets`


## bowerFiles:

* _enabled_ - (Boolean) value for compiling Bower files.
* _dir_ - Path to Bower file directory.


## browserSync:

[Browser Sync](https://browsersync.io/) allows you to watch your changes happen in the browser as you develop. It also allows you to share your browser with others via a network.

* _enabled_ - (Boolean) value to turn on Browser Sync as part of the "watch" Gulp task.
* _port_ - The port on which to serve the the site locally.
* _watchFiles_ - (Array) Define specific files of file types to watch.
* _domain_ - Specify a domain at which serve the files in the browser.
* _baseDir_ - Specify the base directory.
* _startPath_ - The path at which to open the browser. This path gets appended to the "domain".
* _openBrowserAtStart_ - (Boolean) value to allow browser to be automatically opened when "watch" task is initiated.
* _browser_ - (Array) List the browser you would like to be used when a browser is opened automatically.
* _reloadDelay_ - Time, in milliseconds, to wait before instructing the browser to reload/inject following a file change event
* _reloadDebounce_ - Wait, in milliseconds, for a specified window of event-silence before sending any reload events.


## themeSync:

The Theme Sync configuration for migrating source files to another project. Once migrated they need to be compiled into dev or production code for that project.

* _enabled_ - (Boolean) value to turn enable "themesync" Gulp task.
* _newsite_ - (Boolean) value to enable a gulp task `gulp newsite` for cloning a starterkit into a new project. Requires a `/starterkit/` directory is available such as [https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one/src/master/starterkit/](https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one/src/master/starterkit/)
* _src_ - (Boolean) False if exporting, or a file path to the source if importing.
* _dest_ - Path to the theme directory or new site. Make sure the path ends in a /.
* _sassSrc_ - Path to find the SASS.
* _sassDest_ - Path to place the SASS in destination.
* _jsSrc_ - Path to find the JavaScript.
* _jsDest_ - Path to place the JavaScript in destination.
* _imagesSrc_ - Path to find the images.
* _imagesDest_ - Path to place the images in destination.


## patternLab:

This configuration is for integration with the [UC Davis SiteFarm One Pattern Lab](https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one). It allows Gulp to build the public pattern lab files from source.

* _enabled_ - (Boolean) value to allow Gulp to build the pattern lab.
* _imagesSrc_ - File path to where to find source images (defaults to `source/images/`).
* _imagesDest_ - File path to where to place images (defaults to `public/images/`).
