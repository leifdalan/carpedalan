#!/usr/bin/env node
const http = require('http');

const arg = process.argv[2];
console.log('arg', arg);
http.get(
  {
    hostname: 'localhost',
    port: arg,
    path: '/healthcheck',
    agent: false, // Create a new agent just for this one request
  },
  res => {
    if (res.statusCode === 200) {
      console.log('200!'); // eslint-disable-line no-console
      process.exit(0);
    } else {
      process.exit(1);
    }
  },
);
