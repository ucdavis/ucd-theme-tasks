const cached = require('gulp-cached');
const eslint = require('gulp-eslint');
const gulpif = require('gulp-if');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

module.exports = function (gulp, config, tasks) {

  // Compile custom javascript
  gulp.task('js', 'Compile custom javascript, concat and uglify into a single ' + config.js.destName + ' file.', function (done) {

    const webpackConfig = {
      mode: (config.js.uglify) ? 'production' : 'development',
      output: {
        filename: config.js.destName
      },
      devtool: (config.js.sourceMapEmbed) ? 'inline-source-map' : 'source-map',
      module: {
        rules: []
      }
    }

    if (config.js.babel) {
      webpackConfig.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'] // all babel options handled in `.babelrc`
        }
      })
    }

    if (config.js.externals) {
      webpackConfig.externals = config.js.externals;
    }

    gulp.src(config.js.src)
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(config.js.dest))
      .on('end', function () {
        done();
      });
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
