const exec = require('child_process').exec;
const browserSync = require('browser-sync');

module.exports = function (gulp, config, tasks) {

  // Compile Patternlab
  gulp.task('patternlab', 'Compile Patternlab patterns into html.', function () {
    // Setup a list of all commands to be run
    const command = [
      'php core/builder.php -gp',
      'rsync -r --delete ' + config.patternLab.imagesSrc + '* ' + config.patternLab.imagesDest
    ].join('&&');

    // Execute the commands
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);

      // Reload if using browsersync
      if (config.browserSync.enabled) {
        const server = browserSync.get('server');
        if (server.active) {
          server.reload();
        }
      }
    });
  });
  tasks.compile.push('patternlab');


  // Watch for changes
  gulp.task('watch:markup', function () {
    let tasks = ['patternlab'];
    return gulp.watch(['source/_patterns/**/*.mustache', 'source/_patterns/**/*.json', 'source/_data/*.json'], tasks);
  });
  tasks.watch.push('watch:markup');

};
