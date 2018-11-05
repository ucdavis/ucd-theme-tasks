const copy = require('recursive-copy');

module.exports = function (gulp, config, tasks) {

  // Start a new project with Gulp, sass, js and config ready to go
  gulp.task('newsite', 'Start a new site with gulp and config wired up.', function () {

    // Copy the starterkit to its new location.
    copy('starterkit', config.themeSync.dest, {dot: true}, function (error, results) {
      if (error) {
        console.error('Starterkit Copy failed: ' + error);
      } else {
        console.info('Starterkit directory structure copied.');

        // Copy root files.
        copy('./', config.themeSync.dest, {dot: true, filter: ['.eslintrc.yml', '.sass-lint.yml', 'gulpfile.js']}, function (error, results) {
          if (error) {
            console.error('Root files Copy failed: ' + error);
          }
        });

        // Copy Sass directory.
        copy(config.themeSync.sassSrc, config.themeSync.dest + config.themeSync.sassDest, {overwrite: true}, function (error, results) {
          if (error) {
            console.error('Sass directory Copy failed: ' + error);
          }
        });

        // Copy JS directory.
        copy(config.themeSync.jsSrc, config.themeSync.dest + config.themeSync.jsDest, {overwrite: true}, function (error, results) {
          if (error) {
            console.error('Js directory Copy failed: ' + error);
          }
        });

        // Copy Images directory.
        copy(config.themeSync.imagesSrc, config.themeSync.dest + config.themeSync.imagesDest, {filter: ['**/*', '!sample/**/*', '!sample' ]}, function (error, results) {
          if (error) {
            console.error('Images directory Copy failed: ' + error);
          }
        });

      }
    });

  });

};
