module.exports = {
  css: {
    enabled: true,
    src: [
      'sass/**/*.scss',
      '!sass/1_pattern_lab/**/*'
    ],
    vendor: [
      'sass/vendor/**/*.css'
    ],
    autoVendor: true,
    dest: 'dist/',
    flattenDestOutput: true,
    lint: {
      enabled: true,
      failOnError: true,
      extraSrc: null
    },
    sourceComments: false,
    sourceMapEmbed: false,
    outputStyle: 'compressed',
    autoPrefixerBrowsers: [
      'last 2 versions',
      'IE >= 9'
    ]
  },
  js: {
    enabled: true,
    src: [
      'js/vendor/**/*.js',
      'js/**/*.js',
    ],
    externals: {}, // https://webpack.js.org/configuration/externals/
    dest: 'dist/',
    destName: 'scripts.js',
    uglify: true,
    babel: true,
    eslint: {
      enabled: false,
      failAfterError: true,
      extraSrc: [
        '!js/vendor/**/*.js'
      ]
    }
  },
  nodeFiles: {
    enabled: true,
    dir: 'node_modules',
    includePaths: [
      'node_modules/breakpoint-sass/stylesheets',
      'node_modules/sass-toolkit/stylesheets',
      'node_modules/sass-burger',
      'node_modules/normalize-scss/sass'
    ]
  },
  browserSync: {
    enabled: false,
    port: 3050,
    watchFiles: null,
    domain: null,
    baseDir: './',
    startPath: '/',
    openBrowserAtStart: true,
    browser: [
      'Google Chrome'
    ],
    reloadDelay: 50,
    reloadDebounce: 750
  },
  themeSync: {
    enabled: false,
    newsite: false,
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
    imagesDest: 'images/'
  },
  patternLab: {
    enabled: false,
    imagesSrc: 'source/images/',
    imagesDest: 'public/images/',
    version: 3
  }
}
