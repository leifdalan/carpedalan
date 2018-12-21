#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs-extra');
const glob = require('glob'); // eslint-disable-line

glob('/Users/leif/Desktop/photos/**/*.jpg', async (er, files) => {
  for (file of files) {
    fs.move(
      file,
      `/Users/leif/Desktop/flattened/${file.split('/').pop(-1)}`,
      (err, suc) => {
        console.log(err);
      },
    );
  }
});
