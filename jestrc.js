module.exports = {
  coverageThreshold: {
    global: {
      statements: 75.5,
      branches: 41.5,
      functions: 52.5,
      lines: 77,
    },
  },
  transform: {
    '^.+\\.jsx?$': 'babel7-jest',
  },
  collectCoverageFrom: [
    'api/**/*',
    'server/**/*',
    '!server/config.js',
    '!server/constants.js',
    '!server/devMiddleware.config.js',
    '!server/db.js',
    '!api/setup/**/*',
  ],

  // transform: {
  //   '\\.m?js$': 'esm',
  // },
  // transformIgnorePatterns: [],
  testEnvironment: 'node',
  roots: ['api', 'server'],
  setupTestFrameworkScriptFile: './api/setup/setupTests.js',
  globalSetup: './api/setup/globalSetup.js',
  globalTeardown: './api/setup/globalTeardown.js',
};
