#!/usr/bin/env node
const http = require('http');
const fs = require('fs');

const { PROD_BUILD } = process.env;

if (PROD_BUILD === 'true') {
  try {
    if (fs.existsSync('/app/dist/manifest.json')) process.exit(0);
    process.exit(1);
  } catch (e) {
    process.exit(1);
  }
} else {
  http.get(
    {
      hostname: 'localhost',
      port: 4000,
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
}
