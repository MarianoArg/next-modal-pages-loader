const path = require('path');
const fs = require('fs');

/**
 * Determines if the path is prefixed or not
 *
 * @param {String} relativePath - Relative path to check for directory prefixes
 * @returns True if path prefix exists, otherwise false
 */
const hasPathPrefix = relativePath =>
  relativePath.substr(0, 2) === '..' ||
  relativePath.substr(0, 2) === './' ||
  relativePath.substr(0, 2) === '.\\';

/**
 * Correctly formats path separators
 *
 * @param {String} path - Path to format
 * @returns Path with the correct separators
 */
const formatPath = (dir, separator = '/') => {
  const oppositeSep = separator === '/' ? '\\' : '/';
  return dir.replace(new RegExp(`\\${oppositeSep}`, 'g'), separator);
};

/**
 * Converts a path into a relative path
 *
 * @param {String} file - File to convert to a relative path
 * @param {String} fromDir - Directory to resolve to
 * @param {String} separator - Path separator character (default: system separator)
 */
const getRelativePath = (file, fromDir) => {
  // format paths to the OS specific format
  // (accounting for using the wrong seps)
  let relativePath = path.relative(
    formatPath(fromDir, path.sep),
    formatPath(file, path.sep)
  );

  // Prefix the path if it is not already prefixed
  if (!hasPathPrefix(relativePath)) {
    relativePath = `./${relativePath}`;
  }

  return formatPath(relativePath);
};

/**
 * Ensures the direct for the specified filePath exists
 *
 * @param {String} filePath - Path to a file
 */
const ensureFileDirectoryExists = filePath => {
  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};

/**
 * Check if the specified filePath exists
 *
 * @param {String} filePath - Path to a file
 */
const checkIfFileExist = filePath => {
  const directory = path.dirname(filePath);

  return fs.existsSync(directory);
};

/**
 * Converts a path into a relative path
 *
 * @param {String} file - File to convert to a relative path
 * @param {String} fromDir - Directory to resolve to
 * @param {String} separator - Path separator character (default: system separator)
 */

const getPageData = (file, fromDir) => {
  const relativePath = getRelativePath(file.file, fromDir);
  const reg = new RegExp(`(.*${file.baseDir})|\/$`, 'g');
  const { base, dir, name, ext } = path.parse(relativePath);
  const baseName = path.basename(base, ext);
  const url = path
    .format({
      dir,
      base: baseName !== 'index' ? baseName : '',
    })
    .replace(reg, '');
  const componentName = url
    .split('/')
    .slice(-3)
    .map(str => {
      const cleaned = str.replace(/[^a-zA-Z]+/g, '');
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join('');
  return {
    relativePath,
    baseName,
    url,
    componentName,
  };
};

module.exports = {
  getRelativePath,
  ensureFileDirectoryExists,
  formatPath,
  getPageData,
};
