const glob = require('glob');
const { formatPath } = require('../utils/pathHelper');

/**
 * Locates files matching the specified pattern
 *
 * @param {String} pattern - Pattern to use to locate files
 * @returns {Array<String>} - Array of located files
 */
const loadPages = (baseDir, pattern, directories) =>
  glob.sync(pattern).map(file => {
    const relative = directories.find(dir => file.includes(dir.dir));
    return {
      baseDir,
      file: formatPath(file),
      dir: relative ? relative.dir : baseDir,
      group: relative ? relative.group : '',
    };
  });

module.exports = { loadPages };
