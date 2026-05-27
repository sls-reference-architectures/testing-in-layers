const baseConfig = require('./jest.config.js');

const esModules = ['aws-testing-library', 'filter-obj'];

const config = {
  ...baseConfig,
  testMatch: ['**/?(*.)+(int.test).[jt]s?(x)'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@middy/core|@middy/http-error-handler|@middy/util|@middy/input-output-logger)/)',
    `node_modules/(?!${esModules.join('|')})`,
  ],
  moduleNameMapper: {
    '^@middy/core$': '<rootDir>/node_modules/@middy/core',
    '^@middy/util$': '<rootDir>/node_modules/@middy/util',
    '^@middy/http-error-handler$': '<rootDir>/node_modules/@middy/http-error-handler',
    '^@middy/input-output-logger$': '<rootDir>/node_modules/@middy/input-output-logger',
    '^filter-obj$': '<rootDir>/node_modules/filter-obj',
  },
  globalSetup: './test/jest.setup.ts',
  testTimeout: 60000,
};

module.exports = config;
