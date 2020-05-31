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

function setupMocks() {
  glob.sync = jest.fn(() => files);
  formatPath.mockImplementation(f => f);
}

test('loadPages should locate stories', () => {
  setupMocks();
  const actual = loadPages();
  expect(actual).toEqual(files);
  expect(formatPath).toHaveBeenCalledWith(files[0]);
  expect(formatPath).toHaveBeenCalledWith(files[1]);
});

test('loadPages should perform expected work', () => {
  setupMocks();
  const pattern = faker.system.fileName();

  loadPages(pattern);

  expect(glob.sync).toHaveBeenCalledWith(pattern);
});
