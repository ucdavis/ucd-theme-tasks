// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  extends: 'ucd-theme-tasks',

  // This
  mount: {
    js: '/',
    sass: '/',
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
