const logger = require('./logger');
const { loadPages } = require('./pageFinder');
const { writeFile } = require('./writer');

const sortFiles = files => files.concat().sort();

const writeOutPageLoader = pathConfig => {
  logger.debug('writeOutPageLoader', pathConfig);
  pathConfig.outputFiles.forEach(outputFileConfig => {
    logger.info('Output file:      ', outputFileConfig.outputFile);
    logger.info('Loader Dir:       ', outputFileConfig.loaderDir);
    logger.info(
      'Patterns:         ',
      JSON.stringify(outputFileConfig.patterns)
    );

    const pageFiles = [];
    outputFileConfig.patterns.forEach(({ base, pattern }) => {
      const patternPages = loadPages(base, pattern);
      Array.prototype.push.apply(pageFiles, patternPages);
      logger.info(
        `Located ${patternPages.length} files matching pattern '${pattern}'`
      );
    });
    const sortedFiles = sortFiles(pageFiles);
    writeFile(
      sortedFiles,
      outputFileConfig.outputFile,
      outputFileConfig.loaderDir
    );
    logger.info(
      `Compiled pages import for ${pageFiles.length} files:\n`,
      ` ${pageFiles.map(page => page.file).join('\n  ')}`
    );
  });
};

module.exports = { writeOutPageLoader };
