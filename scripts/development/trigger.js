#!/usr/bin/env node

// aws lambda invoke \
//   --function-name "ImageResizer" \
//   --endpoint-url "http://localhost:3001" \
//   --no-verify-ssl \
//   --payload "$(cat imageResizer/s3put.json)" \
//   --profile fake
const { spawnSync } = require('child_process');
const { readFileSync } = require('fs');

const arg = process.argv[2];
console.error('arg', arg);

async function main() {
  const payload = `
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
            "key": "raw/${arg}",
            "size": 1024,
            "eTag": "0123456789abcdef0123456789abcdef",
            "sequencer": "0A1B2C3D4E5F678901"
          }
        }
      }
    ]
  }  
`;
  spawnSync(
    'aws',
    [
      'lambda',
      'invoke',
      '--function-name',
      'ImageResizer',
      '--endpoint-url',
      'http://localhost:3001',
      '--no-verify-ssl',
      '--payload',
      payload,
      'response.json',
      '--profile',
      'fake',
    ],
    { stdio: 'inherit' },
  );
  spawnSync(
    'aws',
    [
      'lambda',
      'invoke',
      '--function-name',
      'Redis',
      '--endpoint-url',
      'http://localhost:3001',
      '--no-verify-ssl',
      '--payload',
      readFileSync('response.json'),
      'redis.json',
      '--profile',
      'fake',
    ],
    { stdio: 'inherit' },
  );
}

module.exports = main;
