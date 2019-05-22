const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const postcss = require('gulp-postcss');
const cached = require('gulp-cached');
const autoprefixer = require('autoprefixer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const flatten = require('gulp-flatten');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const fs = require('fs');

module.exports = (gulp, config, tasks) => {

  // Compile Sass to CSS using Libsass with Autoprefixer and SourceMaps.
  gulp.task('sass', (done) => {
    gulp.src(config.css.src)
      .pipe(sassGlob())
      .pipe(plumber({
        errorHandler: (error) => {
          notify.onError({
            title: 'CSS <%= error.name %> - Line <%= error.line %>',
            message: '<%= error.message %>'
          })(error);
          this.emit('end');
        }
      }))
      .pipe(sourcemaps.init({
        debug: config.debug
      }))
      .pipe(sass({
        outputStyle: config.css.outputStyle,
        sourceComments: config.css.sourceComments,
        includePaths: config.nodeFiles.includePaths
      }).on('error', sass.logError))
      .pipe(postcss(
        [
          autoprefixer({
            browsers: config.css.autoPrefixerBrowsers
          })
        ]
      ))
      .pipe(sourcemaps.write((config.css.sourceMapEmbed) ? null : './'))
      .pipe(gulpif(config.css.flattenDestOutput, flatten()))
      .pipe(gulp.dest(config.css.dest))
      .on('end', () => {
        done();
      });
  });
  tasks.compile.push('sass');


  // Compile all vendor css (including NPM Dependencies) into a single vendor.css file
  gulp.task('css:vendor', () => {
    let sources = [];

    if (config.css.autoVendor) {
      // Get CSS files from node_modules that are npm "dependencies". Ignores "devDependencies".
      const buffer = fs.readFileSync('./package.json');
      const packageJson = JSON.parse(buffer.toString());

      for (lib in packageJson.dependencies) {
        let mainFileDir = './' + config.nodeFiles.dir + '/' + lib;

        // Look first for a "dist" directory.
        if (fs.existsSync(mainFileDir + '/dist')) {
          mainFileDir = mainFileDir + '/dist';
        } else {
          // Parse the main file and get its directory to look for a "dist" directory.
          var depPackageBuffer = fs.readFileSync(mainFileDir + '/package.json');
          var depPackage = JSON.parse(depPackageBuffer.toString());

          if (depPackage.main) {
            var mainFile = mainFileDir + '/' + depPackage.main;
            var distDirPos;

            distDirPos = mainFile.lastIndexOf('/dist/');

            if (distDirPos !== -1) {
              mainFileDir = mainFile.substring(0, distDirPos) + '/dist';
            }
          }
        }

        // Add all CSS files
        sources.push(mainFileDir + '/**/*.css');
        // Ignore minified CSS files.
        sources.push('!' + mainFileDir + '/**/*.min.css');
        // Ignore CSS files in a /test or /tests directory.
        sources.push('!' + mainFileDir + '/(test|tests)/**/*');
      }
    }

    sources = sources.concat(config.css.vendor);

    return gulp.src(sources)
      .pipe(concat('vendor.css'))
      .pipe(gulpif(config.css.outputStyle === 'compressed', cssnano()))
      .pipe(gulp.dest(config.css.dest));
  });
  tasks.compile.push('css:vendor');


  // Validate Sass files with Sass-lint
  gulp.task('validate:css', () => {
    let src = config.css.src;
    if (config.css.lint.extraSrc) {
      src = src.concat(config.css.lint.extraSrc);
    }
    return gulp.src(src)
      .pipe(cached('validate:css'))
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(gulpif(config.css.lint.failOnError, sassLint.failOnError()));
  });
  if (config.css.lint.enabled) {
    tasks.validate.push('validate:css');
  }

  // Watch for changes
  gulp.task('watch:css', async () => {
    let tasks = ['sass'];
    if (config.css.lint.enabled) {
      tasks.push('validate:css');
    }

    let watcher = gulp.watch(config.css.src);
    watcher.on('change', gulp.parallel(tasks));
  });
  tasks.watch.push('watch:css');

};
