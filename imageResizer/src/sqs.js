/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved */
const fs = require('fs');
const { promisify } = require('util');

const aws = require('aws-sdk');
const sqip = require('sqip');
const redis = require('redis');

const { REDIS_URL, BUCKET } = process.env;

const s3 = new aws.S3();
const client = redis.createClient({
  url: REDIS_URL,
});

// @TODO add to dead letter queue on outer try catch. LAME!
const set = promisify(client.set).bind(client);
// const get = promisify(client.get).bind(client);
exports.sqs = async event => {
  const { Records } = event;
  console.log('Records', Records);
  let messageBody;
  let buffer;
  try {
    messageBody = JSON.parse(Records[0].body);
  } catch (error) {
    console.log('JSON error', error);
    throw error;
  }
  const { id, key } = messageBody;
  try {
    buffer = await s3
      .getObject({
        Key: key,
        Bucket: BUCKET,
      })
      .promise();
    console.log(buffer);
  } catch (e) {
    console.log('S3 error', e);
    throw e;
  }
  console.time('sqip');
  let sqipObject;
  const temp = key.split('/')[1];
  try {
    fs.writeFileSync(`/tmp/${temp}`, buffer.Body, 'utf8');

    sqipObject = sqip({
      filename: `/tmp/${temp}`,
      numberOfPrimitives: 25,
    });
  } catch (e) {
    console.log('squip error', e);
    throw e;
  }

  try {
    const stuff = await set(id, sqipObject.final_svg);
    console.log('redis', stuff);
  } catch (e) {
    console.log('redis error', e);
    throw e;
  }
  return {
    statusCode: 200,
    message: sqipObject.final_svg,
  };
};
