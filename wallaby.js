module.exports = function(wallaby) {
  return {
    files: [
      '**/*.js?(x)',
      '!**/__tests__/*.js?(x)',
      '!**/node_modules/**/*',
      '!devtools/**/*',
      '!data.js',
      '!dist/**/*',
      '!coverage/**/*',
      '!scripts/**/*',
      '!**/__mocks__/**/*',
      '!**/cypress/**/*',
    ],
    filesWithNoCoverageCalculated: [
      'db/**/*',
      '/*.*',
      'api/setup/**/*',
      'webpack.prod.js',
      'jestrc.js',
      'vandelay-js.js',
      'wallaby.js',
      'shared/constants.js',
      'webpack.config.js',
      'babel.config.js',
      'index.js',
    ],
    tests: [
      '**/__tests__/*.js?(x)',
      '!node_modules/**/*',
      '!**/node_modules/**/*',
    ],

    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: `LOCAL_PATH=${process.cwd()};WALLABY=true;NODE_ENV=test;LOG_LEVEL=none;NODE_ENV=test;PG_HOST=localhost;PG_PORT=5555;PG_USER=postgres;PG_PASSWORD=postgres;SESSION_SECRET=test;PUBLIC_PASSWORD=testpublic;ADMIN_PASSWORD=testadmin;PG_DATABASE=carpedalan;PORT=3002`,
      },
    },

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel(),
    },

    testFramework: 'jest',

    debug: true,

    lowCoverageThreshold: 50,
  };
};
