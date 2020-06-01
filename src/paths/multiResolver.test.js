const path = require('path');
const mock = require('mock-fs');

const { appName } = require('../constants');
const resolvePaths = require('./multiResolver');
jest.mock('../logger');

function generatePackageJson(searchDir, pattern, outputFile, loaderDir) {
  return {
    config: {
      [appName]: {
        // match name of the project
        searchDir,
        pattern,
        outputFile,
        loaderDir,
      },
    },
  };
}

const baseDir = path.resolve(process.cwd());
const packageJsonFilePath = path.resolve(baseDir, 'package.json');

afterEach(() => {
  mock.restore();
});

test('should resolve expected defaults', () => {
  const packageJsonContents = {};
  mock({ [packageJsonFilePath]: JSON.stringify(packageJsonContents) });
  const expected = {
    outputFiles: [
      {
        patterns: [
          {
            base: './',
            pattern: path.resolve(baseDir, './modalPages/pages/index.js'),
          },
        ],
        outputFile: path.resolve(baseDir, './modalPages/routes.js'),
        loaderDir: '',
      },
    ],
  };

  const actual = resolvePaths(baseDir);

  expect(actual).toEqual(expected);
});

test('should resolve expected paths with single search dir', () => {
  const packageJsonContents = generatePackageJson(
    './src/modalPages/pages',
    '**/*.jsx',
    './config/routes.js',
    './components/loaders/default.js'
  );
  mock({ [packageJsonFilePath]: JSON.stringify(packageJsonContents) });
  const expected = {
    outputFiles: [
      {
        patterns: [
          {
            base: './src/modalPages/pages',
            pattern: path.resolve(baseDir, './src/modalPages/pages/**/*.jsx'),
          },
        ],
        outputFile: path.resolve(baseDir, './config/routes.js'),
        loaderDir: path.resolve(baseDir, './components/loaders/default.js'),
      },
    ],
  };

  const actual = resolvePaths(baseDir);

  expect(actual).toEqual(expected);
});

test('should resolve expected paths with multiple search dirs', () => {
  const packageJsonContents = generatePackageJson(
    ['./src/modalPages', './components/pages'],
    '**/*.js',
    './config/pages.js',
    './components/loader.js'
  );

  mock({ [packageJsonFilePath]: JSON.stringify(packageJsonContents) });
  const expected = {
    outputFiles: [
      {
        patterns: [
          {
            base: './src/modalPages',
            pattern: path.resolve(baseDir, './src/modalPages/**/*.js'),
          },
          {
            base: './components/pages',
            pattern: path.resolve(baseDir, './components/pages/**/*.js'),
          },
        ],
        loaderDir: path.resolve(baseDir, './components/loader.js'),
        outputFile: path.resolve(baseDir, './config/pages.js'),
      },
    ],
  };

  const actual = resolvePaths(baseDir);

  expect(actual).toEqual(expected);
});

test('should resolve expected paths with cli configs', () => {
  const packageJsonContents = generatePackageJson(
    ['./src/modalPages/pages', './src/secondaryPages/'],
    '**/*.js',
    './modalPages/routes.js',
    './modalPages/loader.js'
  );

  const cliConfig = {
    searchDir: ['./src/modalPages/pages', './src/secondaryPages'],
    pattern: '*.js',
    loaderDir: './modalPages/loader.js',
    outputFile: './modalPages/routes.js',
  };

  mock({ [packageJsonFilePath]: JSON.stringify(packageJsonContents) });
  const expected = {
    outputFiles: [
      {
        patterns: [
          {
            base: './src/modalPages/pages',
            pattern: path.resolve(baseDir, './src/modalPages/pages/*.js'),
          },
          {
            base: './src/secondaryPages',
            pattern: path.resolve(baseDir, './src/secondaryPages/*.js'),
          },
        ],
        loaderDir: path.resolve(baseDir, './modalPages/loader.js'),
        outputFile: path.resolve(baseDir, './modalPages/routes.js'),
      },
    ],
  };

  const actual = resolvePaths(baseDir, cliConfig);

  expect(actual).toEqual(expected);
});
