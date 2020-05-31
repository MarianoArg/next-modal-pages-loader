const fs = require('fs');
const path = require('path');
const findup = require('findup');
const { appName } = require('../constants');
const logger = require('../logger');

/**
 * Returns the default value for the specified
 * @param {string} setting Name of the setting
 */
function getDefaultValue(setting) {
  switch (setting) {
    case 'pattern':
      return './modalPages/pages/index.js';
    case 'outputFile':
      return './modalPages/routes.js';
    case 'extensions':
      return ['.js'];
    case 'searchDir':
      return ['./'];
    case 'loaderDir':
      return '';
    default:
      return './';
  }
}

/**
 * Verifies if the specified setting exists. Returns true if the setting exists, otherwise false.
 * @param {object} pkg the contents of the package.json in object form.
 * @param {string} setting Name of the setting to look for
 */
function hasConfigSetting(pkg, setting) {
  return pkg.config && pkg.config[appName] && pkg.config[appName][setting];
}

/**
 * Gets the value for the specified setting if the setting exists, otherwise null
 * @param {object} pkg pkg the contents of the package.json in object form.
 * @param {string} setting setting Name of the setting to look for
 * @param {bool} ensureArray flag denoting whether to ensure the setting is an array
 */
function getConfigSetting(pkg, setting, ensureArray) {
  if (!hasConfigSetting(pkg, setting)) {
    return null;
  }

  const value = pkg.config[appName][setting];
  if (ensureArray && !Array.isArray(value)) {
    return [value];
  }

  return value;
}

/**
 * Parses the package.json file and returns a config object
 * @param {string} packageJsonFile Path to the package.json file
 */
function getConfigSettings(packageJsonFile) {
  // Locate and read package.json
  const pkg = JSON.parse(fs.readFileSync(packageJsonFile));

  return {
    searchDir:
      getConfigSetting(pkg, 'searchDir', true) || getDefaultValue('searchDir'),
    outputFile:
      getConfigSetting(pkg, 'outputFile') || getDefaultValue('outputFile'),
    pattern: getConfigSetting(pkg, 'pattern') || getDefaultValue('pattern'),
    loaderDir:
      getConfigSetting(pkg, 'loaderDir') || getDefaultValue('loaderDir'),
    extensions:
      getConfigSetting(pkg, 'extensions') || getDefaultValue('extensions'),
  };
}

/**
 * Resolves paths and returns the following schema:
 * {
 *    "outputFiles": [{
 *      "patterns":[],
 *      "outputFile": ""
 *    }, {...}]
 * }
 * @param {string} processDirectory directory of the currently running process
 */
function resolvePaths(processDirectory, cliConfig) {
  logger.debug('resolvePaths', processDirectory, cliConfig);

  const overrides = cliConfig || {};
  // Locate and read package.json
  const packageJsonFile = path.resolve(
    findup.sync(processDirectory, 'package.json'),
    'package.json'
  );
  const baseDir = path.dirname(packageJsonFile);
  const config = {
    ...getConfigSettings(packageJsonFile, baseDir),
    ...overrides,
  };
  const outputFile = path.resolve(baseDir, config.outputFile);

  let loaderDir = '';
  if (config.loaderDir) {
    loaderDir = path.resolve(baseDir, config.loaderDir);
    if (!fs.existsSync(loaderDir)) {
      logger.error(
        `The file espcified in the ${'"loaderDir"'.blue} doesn't exist`
      );
    }
  }

  const outputFiles = [
    {
      outputFile,
      loaderDir,
      patterns: config.searchDir.map(dir => ({
        base: dir,
        pattern: path.resolve(baseDir, dir, config.pattern),
      })),
    },
  ];

  const returnValue = {
    outputFiles,
  };
  logger.debug('resolvePaths', returnValue);
  return returnValue;
}

module.exports = resolvePaths;
