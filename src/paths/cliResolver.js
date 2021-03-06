const logger = require('../logger');

const cliResolver = yargv => {
  logger.debug('cliResolver', yargv);
  if (!yargv || typeof yargv !== 'object') {
    return {};
  }

  const config = {};

  if (yargv.searchDir && Array.isArray(yargv.searchDir)) {
    config.searchDir = yargv.searchDir;
  } else if (yargv.searchDir) {
    config.searchDir = [yargv.searchDir];
  }

  if (yargv.outputDir) {
    config.outputDir = yargv.outputDir;
  }

  if (yargv.pattern) {
    config.pattern = yargv.pattern;
  }

  if (yargv.loaderDir) {
    config.loaderDir = yargv.loaderDir;
  }

  logger.debug('cliResolver:return', config);
  return config;
};

module.exports = cliResolver;
