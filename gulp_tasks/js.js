const cached = require('gulp-cached');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const mainBowerFiles = require('main-bower-files');

module.exports = function (gulp, config, tasks) {

  // Compile javascript
  gulp.task('js', 'Compile javascript (including Bower libraries), concat and uglify into a single ' + config.js.destName + ' file.', function (done) {
    let sources = [];

    // Add Bower files
    if (config.bowerFiles.enabled) {
      sources = mainBowerFiles({
        paths: {
          bowerDirectory: config.bowerFiles.dir
        },
        filter: '**/*.js'
      });
    }

    sources = sources.concat(config.js.src);

    gulp.src(sources)
      .pipe(sourcemaps.init())
      .pipe(gulpif(config.js.babel, babel())) // all babel options handled in `.babelrc`
      .pipe(concat(config.js.destName))
      .pipe(gulpif(config.js.uglify, uglify(
        gulpif(config.js.preserveLicense, {
          preserveComments: 'license'
        }, {})
      )))
      .pipe(sourcemaps.write((config.js.sourceMapEmbed) ? null : './'))
      .pipe(gulp.dest(config.js.dest));
  });
  tasks.compile.push('js');


  // Validate using ESlint
  gulp.task('validate:js', 'Lint JS using ESlint', function () {
    let src = config.js.src;
    if (config.js.eslint.extraSrc) {
      src = src.concat(config.js.eslint.extraSrc);
    }
    return gulp.src(src)
      .pipe(cached('js'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(gulpif(config.js.eslint.failAfterError, eslint.failAfterError()));
  });
  tasks.validate.push('validate:js');


  // Watch for changes
  gulp.task('watch:js', function () {
    let tasks = ['js'];
    if (config.js.eslint.enabled) {
      tasks.push('validate:js');
    }
    return gulp.watch(config.js.src, tasks);
  });
  tasks.watch.push('watch:js');

};
