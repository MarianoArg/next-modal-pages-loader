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
        outputFile: faker.system.fileName(),
        patterns: [faker.system.fileName(), faker.system.fileName()],
      },
      {
        outputFile: faker.system.fileName(),
        patterns: [faker.system.fileName()],
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
    config.outputFiles[0].patterns[0]
  );
  expect(pageFinder.loadPages).toHaveBeenCalledWith(
    config.outputFiles[0].patterns[1]
  );
  expect(pageFinder.loadPages).toHaveBeenCalledWith(
    config.outputFiles[1].patterns[0]
  );

  expect(writer.writeFile).toHaveBeenCalledWith(
    firstFiles.concat(secondFiles).sort(),
    config.outputFiles[0].outputFile
  );
  expect(writer.writeFile).toHaveBeenCalledWith(
    noFiles.concat().sort(),
    config.outputFiles[1].outputFile
  );
});
