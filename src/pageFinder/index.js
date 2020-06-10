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
    const matches = directories.filter(dir => file.startsWith(dir.dir));
    const relative = matches.reduce(
      (init, el) => {
        if (init.strLength < el.dir.length) {
          return {
            strLength: el.dir.length,
            el,
          };
        }
        return init;
      },
      { strLength: 0, el: null }
    );

    return {
      baseDir,
      file: formatPath(file),
      dir: relative.el ? relative.el.dir : baseDir,
      group: relative.el ? relative.el.group : '',
    };
  });

module.exports = { loadPages };
