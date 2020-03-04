/* eslint-disable no-restricted-syntax,no-await-in-loop */
const path = require('path');
const fs = require('fs');
const { performance } = require('perf_hooks');
const https = require('https');

https.globalAgent.options.secureProtocol = 'SSLv3_method';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = require('superagent');
const aws = require('aws-sdk');

const getPayload = fileName => `
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "local-bucket",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::carpedalan-dev-private-bucket-5b604e7"
        },
        "object": {
          "key": "raw/${fileName}",
          "size": 1024,
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901"
        }
      }
    }
  ]
}  
`;

const config = new aws.Config();
config.update({
  accessKeyId: 'farts',
  secretAccessKey: 'farts',
  region: 'us-east-1',
});
const lambda = new aws.Lambda({
  endpoint: 'http://sam:3001',
  region: 'us-east-1',
});

const s3 = new aws.S3({
  endpoint: 'http://aws:4572',
  s3ForcePathStyle: true,
});
const writeUserAgent = request.agent();

const errors = [];
async function main() {
  try {
    await writeUserAgent
      .post('https://local.carpedalan.com/v1/login')
      .send({ password: 'asd' });

    const dataFiles = fs.readdirSync(path.join('scripts', 'samples'));
    console.log('starting ', dataFiles.length, ' files');
    const hardBeginning = performance.now();
    for (const file of dataFiles) {
      console.log('file', file);
      if (file[0] !== '.') {
        try {
          const api = await writeUserAgent
            .post('https://local.carpedalan.com/v1/posts')
            .send({
              description: '',
              key: file,
            });
          console.error('api.body', api.body);

          const s3res = await s3
            .upload({
              Key: `raw/${file}`,
              Bucket: 'local-bucket',
              Body: fs.readFileSync(path.join('scripts', 'samples', file)),
            })
            .promise();
          console.error('s3res', s3res);

          const { Payload } = await lambda
            .invoke({
              FunctionName: 'ImageResizer',
              Payload: getPayload(file),
            })
            .promise();
          console.error('Payload', Payload);

          const redisResponse = await lambda
            .invoke({
              FunctionName: 'Redis',
              Payload,
            })
            .promise();
          console.error('redisResponse', redisResponse);
        } catch (e) {
          console.error('e.response', e.response);
          errors.push(e);
        }
      }
    }

    const hardEnd = performance.now();
    console.log('finished in ', (hardEnd - hardBeginning) / 1000);
    console.error(JSON.stringify(errors, null, 2));
  } catch (e) {
    console.error('e', e);
  }
}

main();
