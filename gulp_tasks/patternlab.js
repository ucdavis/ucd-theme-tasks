const browserSync = require('browser-sync');
const exec = require('child_process').exec;
const copy = require('recursive-copy');
const fs = require('fs');
let plConfig = null;
let patternlab = null;

module.exports = function (gulp, config, tasks) {
  if (config.patternLab.version !== 1) {
    const buffer = fs.readFileSync('./patternlab-config.json');
    plConfig = JSON.parse(buffer.toString());
    patternlab = require('@pattern-lab/core')(plConfig);
  }

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

  // Compile Patternlab to the public dir.
  gulp.task('patternlab', (done) => {

    // Use the old PHP compiling for version 1 of Pattern Lab.
    if (patternlab) {
      // Use the modern Node version.
      patternlab
        .build({
          cleanPublic: true,
        })
        .then(() => {
          done();
        });
    }
    else {
      // Copy Images directory.
      copy(config.patternLab.imagesSrc, config.patternLab.imagesDest, {overwrite: true})
        .catch(function(error) {
          console.error('Images directory Copy failed: ' + error);
        });

      // Build the patterns with php.
      phpBuild();
      done();
    }

  });
  tasks.compile.push('patternlab');

  // Compile Patternlab patterns into html.
  gulp.task('patternlab:patterns', () => {
    // Use the old PHP compiling for version 1 of Pattern Lab.
    if (patternlab) {
      // Use the modern Node version.
      patternlab
        .patternsonly({
          cleanPublic: plConfig.cleanPublic,
        })
        .then(() => {
          reloadBrowser();
        });
    }
    else {
      phpBuild(true)
    }

  });
  tasks.compile.push('patternlab:patterns');

  // Watch for changes
  gulp.task('watch:markup', () => {
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
