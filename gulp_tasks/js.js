const cached = require('gulp-cached');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const mainBowerFiles = require('main-bower-files');

module.exports = function (gulp, config, tasks) {

  // Compile custom javascript
  gulp.task('js', 'Compile custom javascript, concat and uglify into a single ' + config.js.destName + ' file.', function (done) {
    gulp.src(config.js.src)
      .pipe(sourcemaps.init())
      .pipe(gulpif(config.js.babel, babel({
        presets: ['env']
      }))) // all babel options handled in `.babelrc`
      .pipe(concat(config.js.destName))
      .pipe(gulpif(config.js.uglify, uglify()))
      .pipe(sourcemaps.write((config.js.sourceMapEmbed) ? null : './'))
      .pipe(gulp.dest(config.js.dest))
      .on('end', function () {
        done();
      });
  });
  tasks.compile.push('js');

  // Vendor and Bower JavaScript compile
  gulp.task('js:vendor', 'Compile all vendor js (including Bower) into a single vendor.js file', function (done) {
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

    sources = sources.concat(config.js.vendor);
    gulp.src(sources)
      .pipe(concat('vendor.js'))
      .pipe(gulpif(config.js.uglify, uglify(
        gulpif(config.js.preserveLicense, {
          preserveComments: 'license'
        }, {})
      )))
      .pipe(sourcemaps.write((config.js.sourceMapEmbed) ? null : './'))
      .pipe(gulp.dest(config.js.dest))
      .on('end', function () {
        done();
      });
  });
  tasks.compile.push('js:vendor');


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
