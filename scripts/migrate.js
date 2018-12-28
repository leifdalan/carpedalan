const fs = require('fs');
const stream = require('stream');

const reduce = require('lodash/reduce');
const aws = require('aws-sdk');
const request = require('request');
const moment = require('moment');
const uniq = require('lodash/uniq');

const data = require('../data'); // eslint-disable-line import/no-unresolved

const obj = data.tumblr.data;
/* eslint-disable no-console */
const s3 = new aws.S3();
const allTags = [];
const goodData = reduce(
  obj,
  (acc, val) => {
    if (val.type !== 'photo') return acc;
    const tags = val.tags.map(tag => {
      const lowerTag = tag.toLowerCase();
      allTags.push(lowerTag);
      return lowerTag;
    });

    return [
      ...acc,
      {
        timestamp: val.timestamp,
        date: val.date,
        url: val.photos[0].original_size.url,
        width: val.photos[0].original_size.width,
        height: val.photos[0].original_size.height,
        caption: val.photos[0].original_size.caption,
        summary: val.summary,
        exif: val.photos[0].exif,
        tags,
      },
    ];
  },
  [],
);

fs.writeFile(
  'goodData.json',
  JSON.stringify(goodData, null, 2),
  'utf8',
  () => {},
);
const values = [];
const errors = [];
async function upload() {
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const val of goodData) {
    const passThrough = new stream.PassThrough();
    try {
      request.get(val.url).pipe(passThrough);
    } catch (e) {
      console.log('fucking failure!!!!');
    }

    console.error('summary', val.summary);

    const date = moment(val.date).format('YYYY-MM-DD-HH-MM-ss');
    console.error('date', date);

    const params = {
      Body: passThrough,
      Bucket: 'carpedev',
      Key: `original/${date}-${val.width}-${val.height}.jpg`,
      ContentType: 'image/jpeg',
    };
    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };
    try {
      const response = await s3.upload(params, options).promise();
      console.log('res', response);
      values.push({ ...val, s3: response.ETag });
    } catch (e) {
      console.log(e);
      errors.push(val);
    }
  }
  return { values, errors };
}

async function log() {
  const { values: logValues, errors: logErrors } = await upload();
  fs.writeFile(
    'goodDataWithEtag.json',
    JSON.stringify(logValues, null, 2),
    'utf8',
    () => {},
  );
  fs.writeFile(
    'errors.json',
    JSON.stringify(logErrors, null, 2),
    'utf8',
    () => {},
  );
}

log();

console.log(uniq(allTags));
