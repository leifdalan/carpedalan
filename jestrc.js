module.exports = {
  coverageThreshold: {
    global: {
      statements: 40.5,
      branches: 30.5,
      functions: 30.5,
      lines: 42,
    },
  },
  collectCoverageFrom: [
    'server/api-v1/**/*',
    'server/routes.js',
    '!server/api-v1/**/index.js',
    '!server/api-v1/setup/**/*',
    '!server/config.js',
    '!server/constants.js',
    '!server/db.js',
    '!api/setup/**/*',
  ],

  // transform: {
  //   '\\.m?js$': 'esm',
  // },
  // transformIgnorePatterns: [],
  // transformIgnorePatterns: [
  //   'node_modules/(?!(react-virtualized|react-select|)/)',
  // ],

  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  testEnvironment: 'node',
  roots: ['server', 'db'],
  setupFilesAfterEnv: ['./server/api-v1/setup/setupTests.js'],
  globalSetup: './server/api-v1/setup/globalSetup.js',
  globalTeardown: './server/api-v1/setup/globalTeardown.js',
};
