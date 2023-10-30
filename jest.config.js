const esModules = ['aws-testing-library', 'filter-obj'];

module.exports = {
  setupFilesAfterEnv: ['./test/setupFrameworks.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
};
