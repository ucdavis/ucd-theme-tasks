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

// Only set inside a DDEV container; Pattern Lab and host-run setups use localhost.
const ddevUrl = process.env.DDEV_PRIMARY_URL;
// Must match the port exposed in .ddev/config.yaml (web_extra_exposed_ports).
const port = Number(process.env.VITE_PORT) || 5173;

// Swap any port already in DDEV_PRIMARY_URL (e.g. :8443) for the Vite port.
const ddevOrigin = () => {
  const url = new URL(ddevUrl);
  url.port = port;
  return url.origin;
};

export default {
  plugins: [
    // Watch the PHP files for changes and reload the browser.
    FullReload(process.cwd() + '/**/*.(php|inc|theme|twig)')
  ],

  // Force relative paths to prevent issues with it rewriting images and other
  // assets assuming they are in the root of the project when often they are
  // deep inside of a drupal theme.
  base: './',

  css: {
    preprocessorOptions: {
      scss: {
        // Vite 7+ rewrites url() in each partial relative to that partial (vitejs/vite#20067).
        // Loading relative @use/@import ourselves keeps url() relative to the entry stylesheet, as in Vite 6.
        importer: {
          findFileUrl(url, { containingUrl }) {
            return containingUrl ? new URL(url, containingUrl) : null;
          },
        },
      },
    },
  },

  server: {
    // Allow cross-origin requests.
    cors: true,
    port,
    // Inside DDEV, listen on all interfaces and fail if the exposed port is taken.
    host: ddevUrl ? '0.0.0.0' : undefined,
    strictPort: Boolean(ddevUrl),
    origin: ddevUrl ? ddevOrigin() : `http://localhost:${port}`,
  },

  build: {
    // generate manifest.json in outDir
    manifest: true,
    // minify: false,
    rolldownOptions: {
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
