module.exports = function(wallaby) {
  return {
    files: [
      '**/*.js?(x)',
      '!**/__tests__/*.js?(x)',
      '!node_modules/**/*',
      '!devtools/**/*',
    ],
    tests: ['**/__tests__/*.js?(x)', '!node_modules/**/*'],

    env: {
      type: 'node',
      runner: 'node',
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel(),
    },

    testFramework: 'jest',

    debug: true,

    lowCoverageThreshold: 50,
  };
};
