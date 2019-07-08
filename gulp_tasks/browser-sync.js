const browserSync = require('browser-sync').create('server');

module.exports = (gulp, config, tasks) => {

  let watchFiles = [];

  // Define CSS files to watch
  if (config.css.enabled) {
    watchFiles.push(config.css.dest + '*.css');
  }

  // Define JS files to watch
  if (config.js.enabled) {
    watchFiles.push(config.js.dest + config.js.destName);
  }

  // Define specific files to watch
  if (config.browserSync.watchFiles) {
    config.browserSync.watchFiles.forEach((file) => {
      watchFiles.push(file);
    });
  }

  let options = {
    browser: config.browserSync.browser,
    files: watchFiles,
    port: config.browserSync.port,
    tunnel: config.browserSync.tunnel,
    open: config.browserSync.openBrowserAtStart,
    reloadDelay: config.browserSync.reloadDelay,
    reloadDebounce: config.browserSync.reloadDebounce
  };
  if (config.browserSync.domain) {
    Object.assign(options, {
      proxy: config.browserSync.domain,
      host: config.browserSync.domain,
      startPath: config.browserSync.startPath
    });

    if (config.browserSync.openBrowserAtStart === true) {
      Object.assign(options, {
        open: 'external'
      });
    }
  }
  else {
    Object.assign(options, {
      server: {
        baseDir: config.browserSync.baseDir
      },
      startPath: config.browserSync.startPath
    });
  }

  // Override all options.
  if (config.browserSync.optionOverrides) {
    Object.assign(options, config.browserSync.optionOverrides);
  }

  // Create a local server using BrowserSync.
  gulp.task('serve', () => {
    return browserSync.init(options);
  });
};
