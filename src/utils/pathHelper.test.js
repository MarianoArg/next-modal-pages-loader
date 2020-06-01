const path = require('path');
const faker = require('faker');
const mockfs = require('mock-fs');
const fs = require('fs');

const { generateArray } = require('../utils/testUtils');
const {
  getRelativePath,
  formatPath,
  ensureFileDirectoryExists,
  getComponentName,
  getPageData,
} = require('./pathHelper');

afterEach(() => mockfs.restore());

describe('getRelativePath()', () => {
  describe('prefixes', () => {
    it('should resolve windows paths with right seps', () => {
      const file = 'c:\\users\\george\\dev\\app\\src\\stuff.js';
      const fromDir = 'c:\\users\\george\\dev\\app\\stories\\';

      const actual = getRelativePath(file, fromDir);

      expect(actual).toEqual('../src/stuff.js');
    });

    it('should resolve windows paths with wrong seps', () => {
      const file = 'c:/users/george/dev/app/src/stuff.js';
      const fromDir = 'c:/users/george/dev/app/stories/';

      const actual = getRelativePath(file, fromDir);

      expect(actual).toEqual('../src/stuff.js');
    });

    it('should resolve unix paths with right seps', () => {
      const file = '/users/george/dev/app/src/stuff.js';
      const fromDir = '/users/george/dev/app/stories/';

      const actual = getRelativePath(file, fromDir);

      expect(actual).toEqual('../src/stuff.js');
    });

    it('should resolve unix paths with wrong seps', () => {
      const file = '\\users\\george\\dev\\app\\src\\stuff.js';
      const fromDir = '\\users\\george\\dev\\app\\stories\\';

      const actual = getRelativePath(file, fromDir);

      expect(actual).toEqual('../src/stuff.js');
    });

    it('should be added when file is in the same folder', () => {
      const relativePath = 'abc123';
      const spy = jest.spyOn(path, 'relative');

      spy.mockImplementation(() => relativePath);

      const actual = getRelativePath(
        faker.system.fileName(),
        faker.system.fileName()
      );

      expect(actual).toEqual(`./${relativePath}`);

      spy.mockReset();
      spy.mockRestore();
    });

    it('should not change a path prefixed with "./"', () => {
      const relativePath = './abc123';
      const spy = jest.spyOn(path, 'relative');

      spy.mockImplementation(() => relativePath);

      const actual = getRelativePath(
        faker.system.fileName(),
        faker.system.fileName()
      );

      expect(actual).toEqual(relativePath);

      spy.mockReset();
      spy.mockRestore();
    });

    it('should not change a path prefixed with ".."', () => {
      const relativePath = '../abc123';
      const spy = jest.spyOn(path, 'relative');

      spy.mockImplementation(() => relativePath);

      const actual = getRelativePath(
        faker.system.fileName(),
        faker.system.fileName()
      );

      expect(actual).toEqual(relativePath);

      spy.mockReset();
      spy.mockRestore();
    });

    it('should not change a path prefixed with ".\\"', () => {
      const relativePath = './abc123';
      const spy = jest.spyOn(path, 'relative');

      spy.mockImplementation(() => relativePath);

      const actual = getRelativePath(
        faker.system.fileName(),
        faker.system.fileName()
      );

      expect(actual).toEqual(relativePath);

      spy.mockReset();
      spy.mockRestore();
    });
  });
});

describe('formatPath()', () => {
  it('should convert unix style paths to windows style', () => {
    const pathSegments = generateArray(() => faker.system.fileName(), 10);
    const sourceDir = pathSegments.join('/');
    const expected = pathSegments.join('\\');

    const actual = formatPath(sourceDir, '\\');

    expect(actual).toEqual(expected);
  });

  it('should convert windows style paths to unix style', () => {
    const pathSegments = generateArray(() => faker.system.fileName(), 10);
    const sourceDir = pathSegments.join('\\');
    const expected = pathSegments.join('/');

    const actual = formatPath(sourceDir, '/');

    expect(actual).toEqual(expected);
  });

  it('should preserve windows style paths', () => {
    const pathSegments = generateArray(() => faker.system.fileName(), 10);
    const expected = pathSegments.join('\\');

    const actual = formatPath(expected, '\\');

    expect(actual).toEqual(expected);
  });

  it('should preservce unix style paths', () => {
    const pathSegments = generateArray(() => faker.system.fileName(), 10);
    const expected = pathSegments.join('/');

    const actual = formatPath(expected, '/');

    expect(actual).toEqual(expected);
  });
});

describe('ensureFileDirectoryExists()', () => {
  it('should create directory when it does not exist', () => {
    const sourceFileDir = faker.random.word();
    const sourceFile = [sourceFileDir, faker.system.fileName()].join(path.sep);
    // mock fs defaults to your current working directory, so append paths to there
    const expectedPath = path.join(process.cwd(), sourceFileDir);

    mockfs({});

    // confirm the dir doesn't already exist
    expect(fs.existsSync(expectedPath)).toBe(false);

    ensureFileDirectoryExists(sourceFile);

    expect(fs.existsSync(expectedPath)).toBe(true);
  });
  it('should not create directory when already exist', () => {
    const sourceFileDir = faker.random.word();
    const sourceFile = [sourceFileDir, faker.system.fileName()].join(path.sep);
    // mock fs defaults to your current working directory, so append paths to there
    const expectedPath = path.join(process.cwd(), sourceFileDir);

    mockfs({
      [sourceFileDir]: {
        /* fake directory */
      },
    });

    ensureFileDirectoryExists(sourceFile);

    expect(fs.existsSync(expectedPath)).toBe(true);
  });
});

describe('getComponentName()', () => {
  it('should build the component name, ', () => {
    const relativePath = './modalPages/pages/user/about';
    const expected = 'PagesUserAbout';
    const actual = getComponentName(relativePath);

    expect(actual).toEqual(expected);
  });
});

describe('getPageData()', () => {
  it('should build the page data and resolve when a folder has an index', () => {
    const file = {
      baseDir: './src/components',
      file: '/users/jhondoe/dev/app/src/components/user/profile/index.js',
    };
    const fromDir = '/users/jhondoe/dev/app/routes/output.js';
    const actual = getPageData(file, fromDir);
    const expected = {
      relativePath: '../../src/components/user/profile/index.js',
      baseName: 'index',
      url: '/user/profile',
      componentName: 'UserProfile',
    };

    expect(actual).toEqual(expected);
  });

  it('should build the page data', () => {
    const file = {
      baseDir: './src/modalPages',
      file: '/users/jhondoe/dev/app/src/modalPages/blog/post/[id].js',
    };
    const fromDir = '/users/jhondoe/dev/app/routes/output.js';
    const actual = getPageData(file, fromDir);
    const expected = {
      relativePath: '../../src/modalPages/blog/post/[id].js',
      baseName: '[id]',
      url: '/blog/post/[id]',
      componentName: 'BlogPostId',
    };

    expect(actual).toEqual(expected);
  });
});
