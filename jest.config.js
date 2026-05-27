const esModules = ['aws-testing-library', 'filter-obj'];

module.exports = {
  setupFilesAfterEnv: ['jest-extended/all', './test/setupFrameworks.ts'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(unit.test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|ts|mjs)$': '@swc/jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
};
