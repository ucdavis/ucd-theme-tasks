const browserSync = require('browser-sync');
const exec = require('child_process').exec;
const copy = require('recursive-copy');
const fs = require('fs');
let plConfig = null;
let patternlab = null;

module.exports = (gulp, config, tasks) => {
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
    exec(command, (err, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);

      // Reload if using browsersync
      if (rebuild) {
        reloadBrowser();
      }
    });
  }

  // Compile Patternlab to the public dir.
  gulp.task('patternlab', async () => {

    // Use the old PHP compiling for version 1 of Pattern Lab.
    if (patternlab) {
      // Use the modern Node version.
      await patternlab
        .build({
          cleanPublic: true,
        });
    }
    else {
      // Copy Images directory.
      copy(config.patternLab.imagesSrc, config.patternLab.imagesDest, {overwrite: true})
        .catch((error) => {
          console.error('Images directory Copy failed: ' + error);
        });

      // Build the patterns with php.
      phpBuild();
    }

  });
  tasks.compile.push('patternlab');

  // Compile Patternlab patterns into html.
  gulp.task('patternlab:patterns', async () => {
    // Use the old PHP compiling for version 1 of Pattern Lab.
    if (patternlab) {
      // Use the modern Node version.
      await patternlab
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

  // Watch for changes
  gulp.task('watch:markup', async () => {
    let tasks = ['patternlab:patterns'];

    const watcher = gulp.watch([
      'source/_patterns/**/*.hbs',
      'source/_patterns/**/*.mustache',
      'source/_patterns/**/*.md',
      'source/_patterns/**/*.json',
      'source/_data/*.json',
      'source/_annotations/*.json',
      'source/_meta/*.json',
      'source/_pl/**/*'
    ])
    watcher.on('change', gulp.parallel(tasks));

    // Rebuild when adding or deleting a file. This will require a manual page
    // refresh still.
    let tasksRebuild = ['patternlab'];
    watcher.on('add', gulp.parallel(tasksRebuild));
    watcher.on('unlink', gulp.parallel(tasksRebuild));
  });
  tasks.watch.push('watch:markup');

};
