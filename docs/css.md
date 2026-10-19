# Using this package to compile (S)CSS

### NPM Sass Dev Dependencies

Install any [NPM](https://www.npmjs.com/) component with the `--save-dev` flag. This is helpful for Sass packages.

    $ npm install {thing} --save-dev

### NPM CSS Dependencies (using in the browser)

Use `--save` when a package needs to be added as a dependency to the browser.

Import that package's css file using [@use](https://sass-lang.com/documentation/at-rules/use)
in a sass file.

All packages in `node_modules` are already mapped so the package can be used
directly.

Example:
```scss
@use "slim-select/dist/slimselect.css";
```

#### Import CSS package via JavaScript
CSS inside `node_modules` can be imported from within Javascript files as
well.

```js
import 'slim-select/dist/slimselect.css';
```
