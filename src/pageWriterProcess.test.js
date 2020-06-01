const faker = require('faker');
const writer = require('./writer');
const pageFinder = require('./pageFinder');
const { generateArray } = require('./utils/testUtils');
const { writeOutPageLoader } = require('./pageWriterProcess');

jest.mock('./writer/index.js');
jest.mock('./pageFinder/index.js');
jest.mock('./paths/multiResolver.js');
jest.mock('./logger');

test('writeOutPageLoader should perform expected work', () => {
  const config = {
    outputFiles: [
      {
        loaderDir: faker.system.fileName(),
        outputFile: faker.system.fileName(),
        patterns: [
          {
            base: faker.system.filePath(),
            pattern: faker.system.fileName(),
          },
          {
            base: faker.system.filePath(),
            pattern: faker.system.fileName(),
          },
        ],
      },
      {
        loaderDir: faker.system.fileName(),
        outputFile: faker.system.fileName(),
        patterns: [
          {
            base: faker.system.filePath(),
            pattern: faker.system.fileName(),
          },
        ],
      },
    ],
  };

  const firstFiles = generateArray(faker.system.fileName);
  const secondFiles = generateArray(faker.system.fileName);
  const noFiles = [];

  pageFinder.loadPages
    .mockImplementationOnce(() => firstFiles)
    .mockImplementationOnce(() => secondFiles)
    .mockImplementationOnce(() => noFiles);

  writeOutPageLoader(config);

  expect(pageFinder.loadPages).toHaveBeenCalledWith(
    config.outputFiles[0].patterns[0].base,
    config.outputFiles[0].patterns[0].pattern
  );
  expect(pageFinder.loadPages).toHaveBeenCalledWith(
    config.outputFiles[0].patterns[1].base,
    config.outputFiles[0].patterns[1].pattern
  );
  expect(pageFinder.loadPages).toHaveBeenCalledWith(
    config.outputFiles[1].patterns[0].base,
    config.outputFiles[1].patterns[0].pattern
  );

  expect(writer.writeFile).toHaveBeenCalledWith(
    firstFiles.concat(secondFiles).sort(),
    config.outputFiles[0].outputFile,
    config.outputFiles[0].loaderDir
  );
  expect(writer.writeFile).toHaveBeenCalledWith(
    noFiles.concat().sort(),
    config.outputFiles[1].outputFile,
    config.outputFiles[1].loaderDir
  );
});
