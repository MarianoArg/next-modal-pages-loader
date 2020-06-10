const logger = require('./logger');
const { loadPages } = require('./pageFinder');
const { writeFile } = require('./writer');
const path = require('path');

const sanitizeName = file =>
  file
    .split('/')
    .map(str => {
      const cleaned = str.replace(/[^a-zA-Z]+/g, '');
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join('');

const getOuputFile = (base, dir) => {
  return path.resolve(base, dir);
};

const sortFiles = files => files.concat().sort();

const groupFiles = (files, base) =>
  files.reduce((group, file) => {
    if (file.group) {
      const sanitized = sanitizeName(file.group);
      return {
        ...group,
        All: {
          output: getOuputFile(base, 'routes.js'),
          files: group.All ? [...group.All.files, file] : [file],
        },
        [sanitized]: {
          output: getOuputFile(base, `${sanitized}Routes.js`),
          files: group[sanitized] ? [...group[sanitized].files, file] : [file],
        },
      };
    }
    return {
      ...group,
      All: {
        output: getOuputFile(base, 'routes'),
        files: group.All ? [...group.All.files, file] : [file],
      },
    };
  }, {});

const writeOutPageLoader = pathConfig => {
  logger.debug('writeOutPageLoader', pathConfig);
  pathConfig.outputFiles.forEach(outputFileConfig => {
    logger.info('Output Folder:      ', outputFileConfig.outputDir);
    logger.info('Loader Dir:       ', outputFileConfig.loaderDir);
    logger.info(
      'Patterns:         ',
      JSON.stringify(outputFileConfig.patterns)
    );

    const pageFiles = loadPages(
      outputFileConfig.searchDir,
      outputFileConfig.patterns,
      outputFileConfig.directories
    );

    logger.info(
      `Located ${pageFiles.length} files matching pattern '${outputFileConfig.patterns}'`
    );

    const groupedFiles = groupFiles(pageFiles, outputFileConfig.outputDir);
    Object.keys(groupedFiles).forEach(key =>
      writeFile(
        groupedFiles[key].files,
        groupedFiles[key].output,
        outputFileConfig.loaderDir
      )
    );

    logger.info(
      `Compiled pages import for ${pageFiles.length} files:\n`,
      ` ${pageFiles.map(page => page.file).join('\n  ')}`
    );
  });
};

module.exports = { writeOutPageLoader };
