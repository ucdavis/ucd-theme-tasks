const copy = require('recursive-copy');
const del = require('del');

module.exports = function (gulp, config, tasks) {

  // Export Patternlab source sass, js, and images to custom site
  gulp.task('themesync', () => {
    // Default to an Export.
    let sassSrc = config.themeSync.sassSrc;
    let sassDest = config.themeSync.dest + config.themeSync.sassDest;
    let jsSrc = config.themeSync.jsSrc;
    let jsDest = config.themeSync.dest + config.themeSync.jsDest;
    let imagesSrc = config.themeSync.imagesSrc;
    let imagesDest = config.themeSync.dest + config.themeSync.imagesDest;

    // if This is an Import
    if (config.themeSync.src) {
      sassSrc = config.themeSync.src + config.themeSync.sassSrc;
      sassDest = config.themeSync.sassDest;
      jsSrc = config.themeSync.src + config.themeSync.jsSrc;
      jsDest = config.themeSync.jsDest;
      imagesSrc = config.themeSync.src + config.themeSync.imagesSrc;
      imagesDest = config.themeSync.imagesDest;
    }

    // Delete and replace the Sass directory.
    if (config.themeSync.sassSync) {
      del(sassDest, {force: true}).then(() => {
        copy(sassSrc, sassDest, {overwrite: true}).catch(function (error) {
          console.error('Sass directory Copy failed: ' + error);
        });
      });
    }

    // Delete and replace the Js directory.
    if (config.themeSync.jsSync) {
      del(jsDest, {force: true}).then(() => {
        copy(jsSrc, jsDest, {overwrite: true}).catch(function (error) {
          console.error('Sass directory Copy failed: ' + error);
        });
      });
    }

    // Copy Images directory (but don't delete the directory first).
    if (config.themeSync.imagesSync) {
      copy(imagesSrc, imagesDest, {
        overwrite: true,
        filter: ['**/*', '!sample/**/*', '!sample'],
      }).catch(function (error) {
        console.error('Images directory Copy failed: ' + error);
      });
    }

  });

};
