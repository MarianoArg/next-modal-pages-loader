// required imports
const faker = require('faker');

// mocked imports
const glob = require('glob');

// test file import
const { formatPath } = require('../utils/pathHelper');
const { loadPages } = require('./');

jest.mock('../utils/pathHelper.js');
jest.mock('glob');

beforeEach(() => {
  jest.clearAllMocks();
});

const files = [faker.system.fileName(), faker.system.fileName()];
const baseDir = faker.system.filePath();
const output = [
  {
    baseDir,
    file: files[0],
  },
  {
    baseDir,
    file: files[1],
  },
];

function setupMocks() {
  glob.sync = jest.fn(() => (baseDir, files));
  formatPath.mockImplementation(f => f);
}

test('loadPages should locate pages', () => {
  setupMocks();
  const actual = loadPages();
  expect(actual).toEqual(output);
  expect(formatPath).toHaveBeenCalledWith(files[0]);
  expect(formatPath).toHaveBeenCalledWith(files[1]);
});

test('loadPages should perform expected work', () => {
  setupMocks();
  const baseDir = faker.system.filePath();
  const pattern = faker.system.fileName();

  loadPages(baseDir, pattern);

  expect(glob.sync).toHaveBeenCalledWith(pattern);
});
