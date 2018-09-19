# Using this package to compile JavaScript

## NPM Javascript Dependencies

The JS in NPM Dependencies *will not* automatically be compiled and added to production javascript.

[Webpack](https://webpack.js.org/) is used to compile all Javascript. Adding a Javascript package into your code is as easy as using a `require()` or `import`.

```js
// ES5
var jQuery = require('jquery');
```

```js
// ES6
import jQuery from 'jquery';
```

If for some reason a file needs a package loaded to the `window` object in order to function, it is best to use `require()` so that Webpack doesn't move it before other code.

```js
import jQuery from 'jquery';
window.jQuery = jQuery;
require('superfish');
```


## Externally loaded Javascript Dependencies

If a Javascript package will be loaded externally (perhaps by a CDN) then you can specify this in config so that Webpack will not add the package into the compiled Javascript file.

```yaml
js:
  externals:
    jquery: 'jQuery'
```


## Compiling of ES6 to ES5 Javascript

By default, all Javascript code will be compiled to ES5 with [Babel](https://babeljs.io/) so that it is safe for Browsers. This means that you can write modern Javascript and take advantage of modern practices. Babel is optional and can be disabled via config.

The [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) is used by default and can be customized in a `.babelrc` file placed into the root of your project.
