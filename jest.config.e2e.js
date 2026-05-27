const baseConfig = require('./jest.config.js');

const config = {
  ...baseConfig,
  testMatch: ['**/?(*.)+(e2e.test).[jt]s?(x)'],
  globalSetup: './test/jest.setup.ts',
  testTimeout: 60000,
};

module.exports = config;
