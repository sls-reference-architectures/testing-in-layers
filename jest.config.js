const esModules = ['aws-testing-library', 'filter-obj'];

module.exports = {
  setupFilesAfterEnv: ['jest-extended/all', './test/setupFrameworks.js'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(unit.test).js?(x)'],
  transform: {
    '^.+\\.(js|mjs)$': '@swc/jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
};
