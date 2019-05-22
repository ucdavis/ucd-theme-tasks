# Using this package to compile (S)CSS

### NPM Sass Dev Dependencies

Install any [NPM](https://www.npmjs.com/) component with the `--save-dev` flag. This is helpful for Sass packages.

    $ npm install {thing} --save-dev
    
The following Sass libraries have been added for ease in development:

* [breakpoint-sass](http://breakpoint-sass.com/) - Media Query helper
* [normalize-scss](https://github.com/JohnAlbin/normalize-scss) - Normalize CSS reset
* [sass-burger](http://joren.co/sass-burger/) - Hambuger Menu
* [sass-toolkit](https://github.com/at-import/toolkit) - Various helper mixins


### NPM CSS Dependencies (using in the browser)

Use `--save` when a package needs to be added as a dependency to the browser.

The CSS in NPM Dependencies *will* automatically be compiled to the `vendor.css` files if the `css:autoVendor` config is set to `true` (which is the default). It will attempt to only load CSS files in each package's `dist` directory, but if one can't be found it will load in all CSS within a package.

If you don't want a file to be used then you can exclude it in the `gulp-config.yml` file.

```yaml
css:
  vendor:
    - '!node_modules/bootstrap/**/*.css'
```

If you prefer not to auto-load every CSS file from a NPM Dependency then set the `css:autoVendor` config to `false`. You will now be required to manually add in each CSS file into the `css:vendor` config array that you want to include in the `vendor.css` file. Manually adding files can be helpful if you prefer to know exactly what is being loaded in.


#### Node Include Paths

If NPM (node.js) is used to add dev dependencies and libraries for Sass then it is helpful to add its `nodeFiles:includePaths` to the `gulp-config.yml` file. This allows shorter import names to work in Sass files.

With an `includePaths` added to the `gulp-config.yml` file a simple `@import "breakpoint";` can be used instead of `@import "../node_modules/breakpoint-sass/stylesheets/breakpoint";"`.

This also helps with any dependencies that a NPM package might rely on.
