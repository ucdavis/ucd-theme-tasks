// import liveReload from 'vite-plugin-live-reload'
// import vue from '@vitejs/plugin-vue'
// import {resolve} from 'path';


// // vite.config.js
// const middleware = () => {
//   return {
//     name: "middleware",
//     apply: "serve",
//     configureServer(viteDevServer) {
//       return () => {
//         viteDevServer.middlewares.use(async (req, res, next) => {
//           if (req.url === '/index.html') {
//             console.log('test')
//             req.url = `/public/${req.url}`;
//           }

//           next();
//         });
//       };
//     },
//   };
// };

export default {
  // plugins: [middleware()],
  // root: 'source',
  // // publicDir: '../public',
  // resolve: {
  //   alias: { '/my-index': resolve(process.cwd(), 'public') }
  // },

  // plugins: [
  //   vue(),
  //   liveReload(__dirname+'/**/*.(php|inc|theme|twig)')
  // ],

  // root: 'source',
  // root: './',
  // base: '/public/',

  // publicDir: 'public',
  // root: 'public',

  // optimizeDeps: {
  //   entries: [
  //     // 'public/index.html',
  //     './source/sass/style.scss',
  //     './source/sass/vendor.scss',
  //     './source/sass/print.scss',
  //     './source/js/main.js',
  //   ]
  // },

  build: {
    outDir: 'build',
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: [
        // './index.html',
        './source/sass/style.scss',
        './source/sass/vendor.scss',
        './source/sass/print.scss',
        './source/js/main.js',
      ],
      // Remove the [hash] since Drupal will take care of that.
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/chunks/[name].[hash].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },

  // server: {
  //   watch: [
  //     '../source/sass/style.scss'
  //   ]
  // },

  // server: {
  //   // required to load scripts from custom host
  //   cors: true,

  //   // we need a strict port to match on PHP side
  //   // change freely, but update on PHP to match the same port
  //   strictPort: true,
  //   port: 12321,

  //   hmr: {
  //     host: 'localhost',
  //   }
  // },

  // resolve: {
  //   alias: {
  //     'jquery': '/js/jquery.module.js'
  //   },
  // },
}
