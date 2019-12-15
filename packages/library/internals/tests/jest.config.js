const path = require('path');

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/**/*.spec.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'html',
    'text-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleFileExtensions: ['js'],
  modulePaths: [
    'src',
    'node_modules',
  ],
  testRegex: '__tests__/.*\\.spec\\.js?$',
  testPathIgnorePatterns: [
    '__tests__/.*\\.skip\\.spec\\.js?$',
  ],
  verbose: true,
  rootDir: path.resolve(process.cwd()),
};
