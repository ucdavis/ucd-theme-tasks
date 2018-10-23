const browserSync = require('browser-sync');
const fs = require('fs');
const buffer = fs.readFileSync('./patternlab-config.json');
const plConfig = JSON.parse(buffer.toString());
const patternlab = require('@pattern-lab/core')(plConfig);

module.exports = function (gulp, config, tasks) {

  // Compile Patternlab
  gulp.task('patternlab', 'Build Patternlab patterns into html.', function (done) {
    patternlab
      .build({
        cleanPublic: true,
      }).then(() => {
        done();
      });
  });
  tasks.compile.push('patternlab');

  gulp.task('patternlab:patterns', 'Compile Patternlab patterns into html.', function () {
    patternlab
      .patternsonly({
        cleanPublic: plConfig.cleanPublic,
      })
      .then(() => {
        if (config.browserSync.enabled) {
          const server = browserSync.get('server');
          if (server.active) {
            server.reload();
          }
        }
      });
  });
  tasks.compile.push('patternlab:patterns');

  // Watch for changes
  gulp.task('watch:markup', function () {
    let tasks = ['patternlab:patterns'];

    return gulp.watch([
      'source/_patterns/**/*.hbs',
      'source/_patterns/**/*.json',
      'source/_data/*.json',
      'source/_annotations/*.json',
      'source/_meta/*.json',
      'source/_pl/**/*'
    ], tasks)
  });
  tasks.watch.push('watch:markup');

};
