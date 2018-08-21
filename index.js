'use strict';

const _ = require('lodash');
const defaultConfig = require('./gulp-config.default');

module.exports = (gulpReference, userConfig, userTasks = {}) => {
  const gulp = require('gulp-help')(gulpReference);

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
  if (config.patternLab.enabled) {
    require('./gulp_tasks/patternlab.js')(gulp, config, tasks);
  }

  if (config.themeSync.newsite) {
    require('./gulp_tasks/newsite.js')(gulp, config, tasks);
  }

  if (config.themeSync.enabled) {
    require('./gulp_tasks/theme-sync.js')(gulp, config, tasks);
  }

  if (config.browserSync.enabled) {
    require('./gulp_tasks/browser-sync.js')(gulp, config, tasks);
  }

  if (config.js.enabled) {
    require('./gulp_tasks/js.js')(gulp, config, tasks);
  }

  if (config.css.enabled) {
    require('./gulp_tasks/css.js')(gulp, config, tasks);
  }

  gulp.task('compile', 'Generate the entire site', tasks.compile);
  tasks.default.unshift('compile');
  gulp.task('validate', 'Validate CSS and JS by linting', tasks.validate);
  gulp.task('watch', 'Watch for changes to files', tasks.watch);
  tasks.default.push('watch');
  gulp.task('default', 'Generate the entire theme and start watching for changes', tasks.default);
}
