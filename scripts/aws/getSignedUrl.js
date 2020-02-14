const AWS = require('aws-sdk');

// const bucket = 'something';
// const accessKeyId = 'AAAAAAAAAAAAAAAA'; // Generated on step 1
// const secretAccessKey = 'farts'; // Generated on step 1

// const awsS3Config = {
//   bucket,
//   access_key: accessKeyId,
//   secret_key: secretAccessKey,
//   region: 'us-west-2',
//   acl: 'public-read', // to allow the uploaded file to be publicly accessible
//   'x-amz-algorithm': 'AWS4-HMAC-SHA256', // algorithm used for signing the policy document
//   success_action_status: '201', // to return an XML object to the browser detailing the file state
// };

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

// const params = getS3Parameters(awsS3Config, 'test.jpg');
// const result = {
//   upload_url: `http://hello.localhost:4572`,
//   params,
// };

// console.log(JSON.stringify(result, null, 2));

main();
