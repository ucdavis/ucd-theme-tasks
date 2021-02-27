// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: 'ucd-theme-tasks',

  mount: {
    js: '/',
    sass: '/',
  },

  alias: {
    'jquery': './js/jquery.module.js',
  },

  buildOptions: {
    out: 'dist',
  },

  optimize: {
    entrypoints: [
      'main.js',
    ],
    minify: true,
    target: 'es2018',
  },
};
