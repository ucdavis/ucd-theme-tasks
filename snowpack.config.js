// Base Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  exclude: [
    '**/node_modules/**/*',
    '**/sass/1_pattern_lab/**/*',
    '**/README.md',
  ],

  plugins: [
    ['@snowpack/plugin-sass', {
      compilerOptions: {
        loadPath: [
          'node_modules',
          'node_modules/breakpoint-sass/stylesheets',
        ],
      },
    }],
  ],

  devOptions: {
    hmr: true,
  },
}
