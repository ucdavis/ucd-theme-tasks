module.exports = {
  css: {
    enabled: true,
    src: [
      'sass/**/*.scss',
      'source/sass/**/*.scss',
      '!sass/1_pattern_lab/**/*',
    ],
    dest: 'dist/',
  },
  js: {
    enabled: true,
    src: [
      'js/vendor/**/*.js',
      'js/**/*.js',
    ],
    dest: 'dist/',
  },
  nodeFiles: {
    enabled: true,
    dir: 'node_modules',
    includePaths: [
      'node_modules/breakpoint-sass/stylesheets',
      'node_modules/sass-toolkit/stylesheets',
      'node_modules/sass-burger',
      'node_modules/normalize-scss/sass',
    ],
  },
  themeSync: {
    src: false,
    dest: '../theme/',
    sassSync: true,
    sassSrc: 'source/sass/',
    sassDest: 'sass/1_pattern_lab/',
    jsSync: true,
    jsSrc: 'source/js/',
    jsDest: 'js/1_pattern_lab/',
    imagesSync: true,
    imagesSrc: 'source/images/',
    imagesDest: 'images/',
    fontSync: true,
    fontSrc: 'source/fonts/',
    fontDest: 'fonts/',
  },
  patternLab: {
    imagesSrc: 'source/images/',
    imagesDest: 'public/images/',
    version: 5,
  },
}
