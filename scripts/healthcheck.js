#!/usr/bin/env node
const http = require('http');

http.get(
  {
    hostname: 'localhost',
    port: 8001,
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
