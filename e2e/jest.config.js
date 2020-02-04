module.exports = {
  coverageThreshold: {
    global: {
      statements: 40.5,
      branches: 30.5,
      functions: 30.5,
      lines: 42,
    },
  },
  testTimeout: 10000,

  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/setupJest.js'],
};
