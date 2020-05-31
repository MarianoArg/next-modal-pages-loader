const { appName } = require('./constants');

test('appName should equal expected value', () => {
  expect(appName).toBe('next-modal-pages-loader');
});
