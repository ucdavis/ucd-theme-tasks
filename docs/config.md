## css

* `enabled` - (Boolean) value that will enable or disable css related Gulp tasks.
* `src` - (Array) The location of all files to compile from SCSS to CSS. Notice the use of asterisks in the source path, `sass/**/*.scss`. This path is using `gulp-sass-glob` to get all files ending in .scss from all folders in source/sass. You can also exclude files by prefixing with `!` such as `!sass/exclude.scss`
* `vendor` - (Array) List of vendor CSS files to include in compilation.
* `dest` - The location to place the compiled CSS.
* `flattenDestOutput` - (Boolean) value for minification of compiled CSS.
* `lint` - Validate code standards with `sass-lint`.
   * `enabled` - (Boolean) to turn CSS code validation on or off.
   * `failOnError` - (Boolean) to stop code from compiling if it does not validate.
   * `extraSrc` - (Array) Add paths to files that you would like to be included in CSS validation. You may exclude files from this process by placing them here, but prefixing the path with an exclamation point. This is the boolean NOT operator also called negation.
* `sourceComments` - (Boolean) to leave or strip comments from the compiled CSS code.
* `sourceMapEmbed` - (Boolean) for adding CSS source maps for in browser SASS debugging.
* `outputStyle` - Tell the compiler whether you want `expanded` or `compressed` output code.
* `autoPrefixerBrowsers` - (Array) List browsers you would like vendor prefixes generated for. [https://github.com/ai/browserslist#queries](https://github.com/ai/browserslist#queries)
* `sassdoc` - Settings for generated SASS documentation. [http://sassdoc.com](http://sassdoc.com)
    * `enabled` - (Boolean) to generate SASS Docs.
    * `dest` - Destination for SASS Documentation code.
    * `verbose` - (Boolean) value to enable or disable verbose mode
    * `basePath` - The SASS base path from the public repository. Notice in the config file this has a child element of "exclude" that you can use to exclude files from this base path.
    * `theme` - Set the theme to be used to display the SASS Docs. We are using "default".
    * `sort` - (Array) Set the sort order of the documentation. [http://sassdoc.com/customising-the-view/#sort](http://sassdoc.com/customising-the-view/#sort)

## js

* `enabled` - (Boolean) value enabling or disabling js Gulp tasks
* `src` - (Array) A list of locations to find JS files. Notice the use of the file globbing technique here. You can also exclude files by prefixing with `!` such as `!js/exclude.js`
* `dest:` - The destination for compiled JS file.
* `destName` - The file name you would like used for the compiled JS file.
* `sourceMapEmbed` - (Boolean) value to enable JS source maps.
* `uglify` - (Boolean) value to minify destination JS file.
* `babel` - (Boolean) enable or disable es6 to es5 compiling with [Babel](https://babeljs.io/)
* `preserveLicense` - (Boolean) whether to preserve a license in a vendor package.
* `eslint` - Settings related to JS validation.
    * `enabled` - (Boolean) value to enable JS validation.
    * `failAfterError` - (Boolean) value to allow js to compile if it doesn't validate.
    * `extraSrc` - (Array) List of files to include or exclude from validation. This is useful for excluding code you didn't write, therefore have no authority to change to meet validation criteria.

## nodeFiles:

* `enabled` - (Boolean) value for including NPM files.
* `dir` - Path to NPM node modules file directory.
* `includePaths` - (Array) List of npm directory paths to look for files such as `node_modules/singularitygs/stylesheets`


## bowerFiles:

* `enabled` - (Boolean) value for compiling Bower files.
* `dir` - Path to Bower file directory.


## browserSync:

[Browser Sync](https://browsersync.io/) allows you to watch your changes happen in the browser as you develop. It also allows you to share your browser with others via a network.

* `enabled` - (Boolean) value to turn on Browser Sync as part of the "watch" Gulp task.
* `port` - The port on which to serve the the site locally.
* `watchFiles` - (Array) Define specific files of file types to watch.
* `domain` - Specify a domain at which serve the files in the browser.
* `baseDir` - Specify the base directory.
* `startPath` - The path at which to open the browser. This path gets appended to the "domain".
* `openBrowserAtStart` - (Boolean) value to allow browser to be automatically opened when "watch" task is initiated.
* `browser` - (Array) List the browser you would like to be used when a browser is opened automatically.
* `reloadDelay` - Time, in milliseconds, to wait before instructing the browser to reload/inject following a file change event
* `reloadDebounce` - Wait, in milliseconds, for a specified window of event-silence before sending any reload events.


## themeSync:

The Theme Sync configuration for migrating source files to another project. Once migrated they need to be compiled into dev or production code for that project.

* `enabled` - (Boolean) value to turn enable "themesync" Gulp task.
* `newsite` - (Boolean) value to enable a gulp task `gulp newsite` for cloning a starterkit into a new project. Requires a `/starterkit/` directory is available such as [https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one/src/master/starterkit/](https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one/src/master/starterkit/)
* `src` - (Boolean) False if exporting, or a file path to the source if importing.
* `dest` - Path to the theme directory or new site. Make sure the path ends in a /.
* `sassSrc` - Path to find the SASS.
* `sassDest` - Path to place the SASS in destination.
* `jsSrc` - Path to find the JavaScript.
* `jsDest` - Path to place the JavaScript in destination.
* `imagesSrc` - Path to find the images.
* `imagesDest` - Path to place the images in destination.


## patternLab:

This configuration is for integration with the [UC Davis SiteFarm One Pattern Lab](https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one). It allows Gulp to build the public pattern lab files from source.

* `enabled` - (Boolean) value to allow Gulp to build the pattern lab.
* `imagesSrc` - File path to where to find source images (defaults to `source/images/`).
* `imagesDest` - File path to where to place images (defaults to `public/images/`).
