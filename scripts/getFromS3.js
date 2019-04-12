#!/usr/bin/env node

const fs = require('fs'); // from node.js

const AWS = require('aws-sdk'); // from AWS SDK

const s3 = new AWS.S3({ signatureVersion: 'v4' });

const params = {
  Bucket: process.env.PIPELINE_BUCKET,
  Key: '.env',
};
const file = fs.createWriteStream('.env');
s3.getObject(params)
  .createReadStream()
  .pipe(file);
