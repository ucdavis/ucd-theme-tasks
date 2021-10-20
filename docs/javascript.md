# Using this package to compile JavaScript

[Vite](https://vitejs.dev/) is used to compile all code and can be
configured with the `vite.config.js` file.
https://vitejs.dev/config/

It is assumed that a `main.js` file will be created as the entry point for
Javascript on the site. When including this script in HTML, be sure to set it as
a `type="module"`

```html
<script src="/dist/main.js" type="module"></script>
```

## NPM Javascript Dependencies

The JS in NPM Dependencies can be imported and used via standard imports.
Vite will convert any packages to be usable in the browser.

[Vite](https://vitejs.dev/) is used to compile all Javascript as
standard [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
files. Adding a Javascript package into your code is as easy as using an
`import`.

```js
import $ from 'jquery';
```

If for some reason a file needs a package loaded to the `window` object in order
to function, it is best to use a dynamic import `import()` so that file will be
loaded after setting a window object parameter.

```js
import $ from 'jquery';
window.jQuery = window.jQuery || $;

export default async function myFunction() {
  // If dynamic imports are not supported by the browser then it should
  // gracefully fail.
  try {
    await import('superfish');
  } catch (e) {
    console.log('Superfish could not be imported.')
  }
}
```

## Externally loaded Javascript Dependencies

If a traditional Javascript package will be loaded externally (perhaps by a CDN)
then you can create an alias as a passthrough package into the compiled
Javascript file.

```js
// vite.config.js
resolve: {
  alias: {
    'jquery': '/js/jquery.module.js'
  }
}
```
```js
// jquery.module.js
export default window.jQuery.noConflict();
```

Alternatively, there is a plugin that can do this https://www.npmjs.com/package/vite-plugin-external

## Preloading Dependencies

Dependencies can be preloaded using [modulepreload](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/modulepreload)
via `<link>` tags in the `<head>`. This speeds up page loading by eliminating
round trip network calls.

```html
<link rel="modulepreload" href="/my-esm-file.js">
```
