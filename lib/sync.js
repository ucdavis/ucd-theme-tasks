const copy = require('recursive-copy');
const del = require('del');

const appendSlash = (url) => {
  if (!url) {
    return url;
  }

  url += url.endsWith('/') ? '' : '/';
  return url;
}

module.exports = function sync (config, options) {
  let dest = options.dest || config.themeSync.dest;
  let src = options.src || config.themeSync.src;

  // Append trailing slashes if they are not present.
  dest = appendSlash(dest);
  src = appendSlash(src);

  // Default to an Export.
  let sassSrc = appendSlash(config.themeSync.sassSrc);
  let sassDest = dest + appendSlash(config.themeSync.sassDest);
  let jsSrc = appendSlash(config.themeSync.jsSrc);
  let jsDest = dest + appendSlash(config.themeSync.jsDest);
  let imagesSrc = appendSlash(config.themeSync.imagesSrc);
  let imagesDest = dest + appendSlash(config.themeSync.imagesDest);
  let fontSrc = appendSlash(config.themeSync.fontSrc);
  let fontDest = dest + appendSlash(config.themeSync.fontDest);

  // If this is an Import.
  if (src) {
    sassSrc = src + appendSlash(config.themeSync.sassSrc);
    sassDest = appendSlash(config.themeSync.sassDest);
    jsSrc = src + appendSlash(config.themeSync.jsSrc);
    jsDest = appendSlash(config.themeSync.jsDest);
    imagesSrc = src + appendSlash(config.themeSync.imagesSrc);
    imagesDest = appendSlash(config.themeSync.imagesDest);
    fontSrc = src + appendSlash(config.themeSync.fontSrc);
    fontDest = appendSlash(config.themeSync.fontDest);
  }

  // Delete and replace the Sass directory.
  if (config.themeSync.sassSync) {
    del(sassDest, {force: true}).then(() => {
      copy(sassSrc, sassDest, {overwrite: true}).catch((error) => {
        console.error('Sass directory Copy failed: ' + error);
      });
    });
  }

  // Delete and replace the Js directory.
  if (config.themeSync.jsSync) {
    del(jsDest, {force: true}).then(() => {
      copy(jsSrc, jsDest, {overwrite: true}).catch((error) => {
        console.error('Sass directory Copy failed: ' + error);
      });
    });
  }

  // Copy Images directory (but don't delete the directory first).
  if (config.themeSync.imagesSync) {
    copy(imagesSrc, imagesDest, {
      overwrite: true,
      filter: ['**/*', '!sample/**/*', '!sample'],
    }).catch((error) => {
      console.error('Images directory Copy failed: ' + error);
    });
  }

  // Copy the Fonts directory (but don't delete the directory first).
  if (config.themeSync.fontSync) {
    copy(fontSrc, fontDest, {
      overwrite: true,
      filter: ['**/*'],
    }).catch((error) => {
      console.error('Fonts directory Copy failed: ' + error);
    });
  }
}
