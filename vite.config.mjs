import FastGlob from 'fast-glob';
import FullReload from 'vite-plugin-full-reload'
import { resolve } from 'node:path';

// Create an array of all the top level JS and SCSS files in the js and sass
// directories.
const inputFiles = FastGlob.sync('(js|sass)/*.(scss|js)', {
  // Ignore Sass partials and the jQuery module.
  ignore: [
    'sass/_*.scss',
    'js/jquery.module.js',
  ]
}).map(file => {
  // This expands the relative paths to absolute paths, so e.g.
  // src/nested/foo becomes /project/src/nested/foo.js
  return resolve(process.cwd(), file)
})

export default {
  plugins: [
    // Watch the PHP files for changes and reload the browser.
    FullReload(process.cwd() + '/**/*.(php|inc|theme|twig)')
  ],

  css: {
    preprocessorOptions: {
      scss: {
        // Use the modern SCSS compiler.
        api: 'modern',
      },
    },
  },

  server: {
    // Allow cross-origin requests.
    cors: true,
    // Force the dev server to use localhost path for the asset URLs.
    origin: 'http://localhost:5173',
  },

  build: {
    // generate manifest.json in outDir
    manifest: true,
    // minify: false,
    rollupOptions: {
      // overwrite default .html entry
      input: inputFiles,
      // Remove the [hash] since Drupal will take care of that.
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].[hash].js`,
        assetFileNames: `[name].[ext]`,
      }
    }
  },

  // Swap any npm jQuery import for the custom local module.
  resolve: {
    alias: {
      jquery: resolve(process.cwd(), 'js/jquery.module.js'),
    },
  },
}
