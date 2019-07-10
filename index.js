'use strict';

const _ = require('lodash');
const defaultConfig = require('./gulp-config.default');

module.exports = (gulp, userConfig, userTasks = {}) => {

  const config = _.merge(defaultConfig, userConfig);

  // Setup a list of primary tasks
  let tasks = {
    compile: [],
    watch: [],
    validate: [],
    default: []
  };
  tasks = _.merge(tasks, userTasks);

  // Load in all tasks
  if (config.themeSync.newsite) {
    require('./gulp_tasks/newsite.js')(gulp, config, tasks);
  }

  if (config.themeSync.enabled) {
    require('./gulp_tasks/theme-sync.js')(gulp, config, tasks);
  }

  if (config.js.enabled) {
    require('./gulp_tasks/js.js')(gulp, config, tasks);
  }

  if (config.css.enabled) {
    require('./gulp_tasks/css.js')(gulp, config, tasks);
  }

  if (config.patternLab.enabled) {
    require('./gulp_tasks/patternlab.js')(gulp, config, tasks);
  }

  if (config.browserSync.enabled) {
    require('./gulp_tasks/browser-sync.js')(gulp, config, tasks);
  }

  // Generate the entire site.
  gulp.task('compile', gulp.series(tasks.compile));
  tasks.default.unshift('compile');

  // Validate CSS and JS by linting.
  gulp.task('validate', gulp.parallel(tasks.validate));

  // Watch for changes to files.
  gulp.task('watch', gulp.parallel(tasks.watch));
  tasks.default.push('watch');

  // Generate the entire theme and start watching for changes.
  if (config.browserSync.enabled) {
    // Run the "serve" task after everything else is finished.
    gulp.task('default', gulp.series(gulp.parallel(tasks.default), 'serve'));
  } else {
    gulp.task('default', gulp.parallel(tasks.default));
  }
}
