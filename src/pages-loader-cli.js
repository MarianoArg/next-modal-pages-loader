#!/usr/bin/env node
const cliResolver = require('./paths/cliResolver');
const logger = require('./logger');
const { writeOutPageLoader } = require('./pageWriterProcess');
const resolvePaths = require('./paths/multiResolver');

const args = require('yargs')
  .usage('$0 [options]')
  .options({
    searchDir: {
      array: true,
      desc:
        'The directory or directories, relative to the project root, to search for files in.',
    },
    loaderDir: {
      desc: 'Path to the loader while page is loading',
      type: 'string',
    },
    pattern: {
      desc:
        "Pattern to search the search directories with. Note: if pattern contains '**/*' it must be escaped with quotes",
      type: 'string',
    },
    outputDir: {
      desc: 'Path to the output folder.',
      type: 'string',
    },
    silent: {
      desc: 'Silences all logging',
      type: 'boolean',
    },
  })
  .help().argv;

if (args.silent) {
  logger.setLogLevel(logger.logLevels.silent);
} else {
  logger.setLogLevel(logger.logLevels.info);
}

logger.debug('yargs', args);

const cliConfig = cliResolver(args);

const pathConfig = resolvePaths(process.cwd(), cliConfig);
logger.info('\nGenerating Dynamic Modal Pages Imports\n');

writeOutPageLoader(pathConfig);
