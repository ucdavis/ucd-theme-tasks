const browserSync = require('browser-sync');
const exec = require('child_process').exec;
const copy = require('recursive-copy');
const fs = require('fs');
const buffer = fs.readFileSync('./patternlab-config.json');
const plConfig = JSON.parse(buffer.toString());
const patternlab = require('@pattern-lab/core')(plConfig);

module.exports = function (gulp, config, tasks) {

  function reloadBrowser() {
    if (config.browserSync.enabled) {
      const server = browserSync.get('server');
      if (server.active) {
        server.reload();
      }
    }
  }

  function phpBuild(rebuild = false) {
    const command = 'php core/builder.php -gp';
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);

      // Reload if using browsersync
      if (rebuild) {
        reloadBrowser();
      }
    });
  }

  // Compile Patternlab
  gulp.task('patternlab', 'Build Patternlab patterns into html.', function (done) {

    // Use the old PHP compiling for version 1 of Pattern Lab.
    if (config.patternLab.version === 1) {
      // Copy Images directory.
      copy(config.patternLab.imagesSrc, config.patternLab.imagesDest, {overwrite: true})
        .catch(function(error) {
          console.error('Images directory Copy failed: ' + error);
        });

      // Build the patterns with php.
      phpBuild();
      done();
    }
    else {
      // Use the modern Node version.
      patternlab
        .build({
          cleanPublic: true,
        })
        .then(() => {
          done();
        });
    }

  });
  tasks.compile.push('patternlab');

  gulp.task('patternlab:patterns', 'Compile Patternlab patterns into html.', function () {
    // Use the old PHP compiling for version 1 of Pattern Lab.
    if (config.patternLab.version === 1) {
      phpBuild(true)
    }
    else {
      // Use the modern Node version.
      patternlab
        .patternsonly({
          cleanPublic: plConfig.cleanPublic,
        })
        .then(() => {
          reloadBrowser();
        });
    }

  });
  tasks.compile.push('patternlab:patterns');

  // Watch for changes
  gulp.task('watch:markup', function () {
    let tasks = ['patternlab:patterns'];

    return gulp.watch([
      'source/_patterns/**/*.hbs',
      'source/_patterns/**/*.mustache',
      'source/_patterns/**/*.md',
      'source/_patterns/**/*.json',
      'source/_data/*.json',
      'source/_annotations/*.json',
      'source/_meta/*.json',
      'source/_pl/**/*'
    ], tasks)
  });
  tasks.watch.push('watch:markup');

};
