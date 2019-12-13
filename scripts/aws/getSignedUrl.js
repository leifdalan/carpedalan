const crypto = require('crypto');

const AWS = require('aws-sdk');
const express = require('express');

const bucket = 'something';
const accessKeyId = 'AAAAAAAAAAAAAAAA'; // Generated on step 1
const secretAccessKey = 'farts'; // Generated on step 1

const awsS3Config = {
  bucket,
  access_key: accessKeyId,
  secret_key: secretAccessKey,
  region: 'us-west-2',
  acl: 'public-read', // to allow the uploaded file to be publicly accessible
  'x-amz-algorithm': 'AWS4-HMAC-SHA256', // algorithm used for signing the policy document
  success_action_status: '201', // to return an XML object to the browser detailing the file state
};

function createHmacDigest(key, string) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.write(string);
  hmac.end();
  return hmac.read();
}
function getS3Parameters(config, filename) {
  const date = new Date().toISOString();

  // create date string for the current date
  const dateString = date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);

  // create upload credentials
  const credential = `${config.access_key}/${dateString}/${config.region}/s3/aws4_request`;

  // create policy
  const policy = {
    expiration: new Date(new Date().getTime() + 1 * 60 * 1000).toISOString(), // to set the time after which upload will no longer be allowed using this policy
    conditions: [
      { bucket: config.bucket },
      { key: `test.jpg` }, // filename with which the uploaded file will be saved on s3
      { acl: config.acl },
      { success_action_status: config.success_action_status },
      ['content-length-range', 0, 50000000], // optional: to specify the minimum and maximum upload limit
      { 'x-amz-algorithm': config['x-amz-algorithm'] },
      { 'x-amz-credential': credential },
      { 'x-amz-date': `${dateString}T000000Z` },
    ],
  };

  // base64 encode policy
  const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');

  // create signature with policy, aws secret key & other scope information
  const dateKey = createHmacDigest(`AWS4${config.secret_key}`, dateString);
  const dateRegionKey = createHmacDigest(dateKey, config.region);
  const dateRegionServiceKey = createHmacDigest(dateRegionKey, 's3');
  const signingKey = createHmacDigest(dateRegionServiceKey, 'aws4_request');

  // sign policy document with the signing key to generate upload signature
  const xAmzSignature = createHmacDigest(signingKey, policyBase64).toString(
    'hex',
  );

  // create upload parameters
  return {
    key: `raw/${filename}`,
    acl: config.acl,
    success_action_status: config.success_action_status,
    policy: policyBase64,
    'x-amz-algorithm': config['x-amz-algorithm'],
    'x-amz-credential': credential,
    'x-amz-date': `${dateString}T000000Z`,
    'x-amz-signature': xAmzSignature,
  };
}

const main = async () => {
  const Bucket = 'something';
  AWS.config.update({
    accessKeyId: 'AAAAAAAAAAAAAAAA', // Generated on step 1
    secretAccessKey: 'farts', // Generated on step 1
    region: 'us-east-1', // Must be the same as your bucket
    signatureVersion: 'v4',
  });
  const params = {
    Bucket,
    Key: 'raw/test.jpg',
    Expires: 30 * 60, // 30 minutes
    ContentType: 'image/jpg',
    ACL: 'public-read',
  };

  const options = {
    signatureVersion: 'v4',
    region: 'us-east-1', // same as your bucket
    endpoint: 'http://localhost:4572',
    s3ForcePathStyle: true,
    // useAccelerateEndpoint: false,
  };
  const client = new AWS.S3(options);
  // try {
  //   const cors = await client.getBucketCors({ Bucket }).promise();
  //   console.error('cors', cors);
  // } catch (e) {
  //   console.error('e', e);
  // }

  const signedURL = await new Promise((resolve, reject) => {
    client.getSignedUrl('putObject', params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  console.error('signedURL', signedURL);

  return signedURL;
};

const params = getS3Parameters(awsS3Config, 'test.jpg');
const result = {
  upload_url: `http://hello.localhost:4572`,
  params,
};

console.log(JSON.stringify(result, null, 2));

main();
