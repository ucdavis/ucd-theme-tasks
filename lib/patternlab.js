const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
let plConfig = {}

// Load in Pattern Lab config.
try {
  const buffer = fs.readFileSync('./patternlab-config.json');
  plConfig = JSON.parse(buffer.toString());
}
catch (e) {
  console.error('No patternlab-config.json file could be found. Are you using Pattern Lab?');
  process.exit();
}

const getWatchPatterns = () => {
  const plSource = plConfig.paths.source;
  const createWatchPath = (key, pattern) => {
    if (plSource[key]) {
      return path.join(path.resolve(plSource[key]), pattern)
    }
    return false
  }

  const defaultPatterns = [
    ['patterns', '**/*.hbs'],
    ['patterns', '**/*.mustache'],
    ['patterns', '**/*.json'],
    ['patterns', '**/*.md'],
    ['data', '*.json'],
    ['meta', '*'],
    ['annotations', '*'],
    ['images', '*'],
    ['fonts', '*'],
    ['pl', '**/*'],
  ]

  return defaultPatterns.flatMap((pattern) => createWatchPath(pattern[0], pattern[1]) || [])
}

module.exports = async function patternlab (parentNodePath, args) {
  const clean = plConfig.cleanPublic;
  // Force the cleanPublic to be false so that partial rebuilds can happen.
  plConfig.cleanPublic = false;

  const patternlab = require(`${parentNodePath}/@pattern-lab/core`)(plConfig);

  /**
   * Build Pattern Lab.
   *
   * @return {Promise<void>}
   */
  const build = async () => {
    // Remove the public directory.
    if (clean) {
      fs.rmdirSync('./public', { recursive: true });
    }

    await patternlab.build({
      cleanPublic: clean,
    });
  };

  /**
   * Build individual Pattern Lab pattern that has changed.
   *
   * @return {Promise<void>}
   */
  const buildChangedPattern = async () => {
    await patternlab.patternsonly({
      cleanPublic: false,
    })
  };

  if (args.watch) {
    const watchPatterns = getWatchPatterns()
    chokidar.watch(watchPatterns).on('change', buildChangedPattern);
  }
  else {
    await build();
  }
}