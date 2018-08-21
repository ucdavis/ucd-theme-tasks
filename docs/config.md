## css

* __enabled__ - (Boolean) value that will enable or disable css related Gulp tasks.
* __src__ - (Array) The location of all files to compile from SCSS to CSS. Notice the use of asterisks in the source path, `sass/**/*.scss`. This path is using `gulp-sass-glob` to get all files ending in .scss from all folders in source/sass. You can also exclude files by prefixing with `!` such as `!sass/exclude.scss`
* __vendor__ - (Array) List of vendor CSS files to include in compilation. Compiles to `vendor.css`.
* __dest__ - The location to place the compiled CSS.
* __flattenDestOutput__ - (Boolean) value for minification of compiled CSS.
* __lint__ - Validate code standards with [sass-lint](https://github.com/sasstools/sass-lint).
   * __enabled__ - (Boolean) to turn CSS code validation on or off.
   * __failOnError__ - (Boolean) to stop code from compiling if it does not validate.
   * __extraSrc__ - (Array) Add paths to files that you would like to be included in CSS validation. You may exclude files from this process by placing them here, but prefixing the path with an exclamation point. This is the boolean NOT operator also called negation.
* __sourceComments__ - (Boolean) to leave or strip comments from the compiled CSS code.
* __sourceMapEmbed__ - (Boolean) for adding CSS source maps for in browser SASS debugging.
* __outputStyle__ - Tell the compiler whether you want `expanded` or `compressed` output code.
* __autoPrefixerBrowsers__ - (Array) List browsers you would like vendor prefixes generated for. [https://github.com/ai/browserslist#queries](https://github.com/ai/browserslist#queries)
* __sassdoc__ - Settings for generated SASS documentation. [http://sassdoc.com](http://sassdoc.com)
    * __enabled__ - (Boolean) to generate SASS Docs.
    * __dest__ - Destination for SASS Documentation code.
    * __verbose__ - (Boolean) value to enable or disable verbose mode
    * __basePath__ - The SASS base path from the public repository. Notice in the config file this has a child element of "exclude" that you can use to exclude files from this base path.
    * __theme__ - Set the theme to be used to display the SASS Docs. We are using "default".
    * __sort__ - (Array) Set the sort order of the documentation. [http://sassdoc.com/customising-the-view/#sort](http://sassdoc.com/customising-the-view/#sort)

## js

* __enabled__ - (Boolean) value enabling or disabling js Gulp tasks
* __src__ - (Array) A list of locations to find JS files. Notice the use of the file globbing technique here. You can also exclude files by prefixing with `!` such as `!js/exclude.js`
* __vendor__ - (Array) List of vendor JS files required which will compile to `vendor.js`.
* __dest__ - The destination for compiled JS file.
* __destName__ - The file name you would like used for the compiled JS file.
* __sourceMapEmbed__ - (Boolean) value to enable JS source maps.
* __uglify__ - (Boolean) value to minify destination JS file.
* __babel__ - (Boolean) enable or disable es6 to es5 compiling with [Babel](https://babeljs.io/)
* __preserveLicense__ - (Boolean) whether to preserve a license in a vendor package.
* __eslint__ - Settings related to JS validation with [ESLint](https://eslint.org/).
    * __enabled__ - (Boolean) value to enable JS validation.
    * __failAfterError__ - (Boolean) value to allow js to compile if it doesn't validate.
    * __extraSrc__ - (Array) List of files to include or exclude from validation. This is useful for excluding code you didn't write, therefore have no authority to change to meet validation criteria.

## nodeFiles:

* __enabled__ - (Boolean) value for including NPM files.
* __dir__ - Path to NPM node modules file directory.
* __includePaths__ - (Array) List of npm directory paths to look for files such as `node__modules/singularitygs/stylesheets`


## bowerFiles:

* __enabled__ - (Boolean) value for compiling Bower files.
* __dir__ - Path to Bower file directory.


## browserSync:

[Browser Sync](https://browsersync.io/) allows you to watch your changes happen in the browser as you develop. It also allows you to share your browser with others via a network.

* __enabled__ - (Boolean) value to turn on Browser Sync as part of the "watch" Gulp task.
* __port__ - The port on which to serve the the site locally.
* __watchFiles__ - (Array) Define specific files of file types to watch.
* __domain__ - Specify a domain at which serve the files in the browser.
* __baseDir__ - Specify the base directory.
* __startPath__ - The path at which to open the browser. This path gets appended to the "domain".
* __openBrowserAtStart__ - (Boolean) value to allow browser to be automatically opened when "watch" task is initiated.
* __browser__ - (Array) List the browser you would like to be used when a browser is opened automatically.
* __reloadDelay__ - Time, in milliseconds, to wait before instructing the browser to reload/inject following a file change event
* __reloadDebounce__ - Wait, in milliseconds, for a specified window of event-silence before sending any reload events.


## themeSync:

The Theme Sync configuration for migrating source files to another project. Once migrated they need to be compiled into dev or production code for that project.

* __enabled__ - (Boolean) value to turn enable "themesync" Gulp task.
* __newsite__ - (Boolean) value to enable a gulp task `gulp newsite` for cloning a starterkit into a new project. Requires a `/starterkit/` directory is available such as [https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one/src/master/starterkit/](https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one/src/master/starterkit/)
* __src__ - (Boolean) False if exporting, or a file path to the source if importing.
* __dest__ - Path to the theme directory or new site. Make sure the path ends in a /.
* __sassSrc__ - Path to find the SASS.
* __sassDest__ - Path to place the SASS in destination.
* __jsSrc__ - Path to find the JavaScript.
* __jsDest__ - Path to place the JavaScript in destination.
* __imagesSrc__ - Path to find the images.
* __imagesDest__ - Path to place the images in destination.


## patternLab:

This configuration is for integration with the [UC Davis SiteFarm One Pattern Lab](https://bitbucket.org/ietwebdev/sitefarm-pattern-lab-one). It allows Gulp to build the public pattern lab files from source.

* __enabled__ - (Boolean) value to allow Gulp to build the pattern lab.
* __imagesSrc__ - File path to where to find source images (defaults to `source/images/`).
* __imagesDest__ - File path to where to place images (defaults to `public/images/`).
