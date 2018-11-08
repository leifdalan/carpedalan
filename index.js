// eslint-disable-next-line
require = require('esm')(module);

module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./server.prod')
    : require('./server.js');
