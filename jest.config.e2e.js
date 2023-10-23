module.exports = {
  ...require('./jest.config.js'),
  globalSetup: './test/jest.setup.ts',
  testTimeout: 60000,
};
