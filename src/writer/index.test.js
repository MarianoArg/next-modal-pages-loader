const mock = require('mock-fs');
const path = require('path');
const fs = require('fs');
const { writeFile } = require('.');
const { encoding } = require('../constants');

const baseDir = path.resolve(__dirname, '../../');
const outputPath = path.resolve(baseDir, 'output.js');
const moduleDir = path.resolve(baseDir);
const loaderDir = path.resolve(baseDir, './components/loaders/loader.js');
const configFile = path.resolve(moduleDir, './module.config.json');

beforeEach(() => {
  mock({
    [outputPath]: '',
    [configFile]: '',
  });
});

afterEach(() => {
  mock.restore();
});

test('writeFile generate dynamic page imports', () => {
  const files = [
    {
      baseDir: baseDir,
      file: path.resolve(__dirname, '../file1.js'),
    },
    {
      baseDir: baseDir,
      file: path.resolve(__dirname, '../sub/file2.js'),
    },
    {
      baseDir: baseDir,
      file: path.resolve(__dirname, '../../parent/file3.js'),
    },
    {
      baseDir: baseDir,
      file: path.resolve(__dirname, './sub/file4.js'),
    },
    {
      baseDir: baseDir,
      file: path.resolve(__dirname, '.\\sub\\sub\\file5.js'),
    },
  ];
  writeFile(files, outputPath, loaderDir);

  const contents = fs.readFileSync(outputPath, encoding);

  expect(contents).toMatchSnapshot();
});

test('writeFile should generate dummy routes map if no pages were found', () => {
  const files = [];
  writeFile(files, outputPath, loaderDir);

  const contents = fs.readFileSync(outputPath, encoding);

  expect(contents).toMatchSnapshot();
});
