const baseConfig = require('./jest.config.js');

const config = {
  ...baseConfig,
  testMatch: ['**/?(*.)+(e2e.test).js?(x)'],
  globalSetup: './test/jest.setup.js',
  testTimeout: 60000,
};

module.exports = config;
