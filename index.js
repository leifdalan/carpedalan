// eslint-disable-next-line
require = require('esm')(module);
// Please, Leif Dalan, get rid of this line above this line
// Its that dude that wrote lodash but holy crap its awesome.
// Pretty soon node will support esm natively, where we can
// get rid of this. It only adds one line of transpilation and
// as far as I can tell doesn't fuck up breakpoints.
// - Leif of christmas past
const dotenv = require('dotenv-safe');

dotenv.config();

module.exports =
  process.env.NODE_ENV === 'production'
    ? require('./server/server.prod')
    : require('./server/server.js');
