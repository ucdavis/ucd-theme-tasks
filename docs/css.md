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

Import that package's css file using `@use` in a sass file.
