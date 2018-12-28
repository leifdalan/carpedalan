#!/usr/bin/env node

const fsExtra = require('fs-extra'); // eslint-disable-line
// const exif = require('exif-parser');
const glob = require('glob'); // eslint-disable-line

// let db;

const main = async () => {
  // await connectionPromise;
  const lengthPromise = new Promise(resolve => {
    const errors = [];
    // const matches = [];
    glob('/Users/leif/Desktop/flattened2/**/*.jpg', async (er, files) => {
      /* eslint-disable no-restricted-syntax,no-await-in-loop,no-console */

      for (const file of files) {
        // const buffer = fs.readFileSync(file);
        // let timestamp;
        try {
          // const parser = exif.create(buffer);
          // const result = parser.parse();
          // timestamp = result.tags.CreateDate;
          // console.log(timestamp);
        } catch (e) {
          // console.log('exif', e);
          errors.push({
            type: 'exifError',
            error: e,
          });
        }
        if (
          file
            .split('/')
            .pop(-1)
            .indexOf('IMG') === 0 &&
          file.split('_').length === 3
        ) {
          fsExtra.move(
            file,
            `/Users/leif/Desktop/filtered/${file.split('/').pop(-1)}`,
            () => {},
          );
        }
      }
      return resolve(files.length);
    });
  });
  return lengthPromise;
};

main().then(res => console.log('res', res));
