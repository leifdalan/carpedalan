// // Load the AWS SDK for Node.js
// const AWS = require('aws-sdk');
// // Set the region
// AWS.config.update({ region: 'us-west-2' });
// // Set the custom endpoint for your acccount
// // AWS.config.mediaconvert({
// //   endpoint: 'https://zcqy3kxqa.mediaconvert.us-west-2.amazonaws.com',
// // });

// const params = {
//   // Endpoint: 'https://zcqy3kxqa.mediaconvert.us-west-2.amazonaws.com',
//   Queue: 'arn:aws:mediaconvert:us-west-2:771396871964:queues/Default',
//   JobTemplate: 'carpedalan',
//   Role: 'arn:aws:iam::771396871964:role/Media-convert-carpedalan',
//   Settings: {
//     Inputs: [
//       {
//         AudioSelectors: {
//           'Audio Selector 1': {
//             Offset: 0,
//             DefaultSelection: 'NOT_DEFAULT',
//             ProgramSelection: 1,
//             SelectorType: 'TRACK',
//             Tracks: [1],
//           },
//         },
//         VideoSelector: {
//           ColorSpace: 'FOLLOW',
//         },
//         FilterEnable: 'AUTO',
//         PsiControl: 'USE_PSI',
//         FilterStrength: 0,
//         DeblockFilter: 'DISABLED',
//         DenoiseFilter: 'DISABLED',
//         TimecodeSource: 'EMBEDDED',
//         FileInput: 's3://carpedalan-video/VID_20190209_113551.mp4',
//       },
//     ],
//   },
// };

// // Create a promise on a MediaConvert object
// const templateJobPromise = new AWS.MediaConvert({
//   apiVersion: '2017-08-29',
//   endpoint: 'https://zcqy3kxqa.mediaconvert.us-west-2.amazonaws.com',
// })
//   .createJob(params)
//   .promise();

// // Handle promise's fulfilled/rejected status
// templateJobPromise.then(
//   function(data) {
//     console.log('Success! ', data);
//   },
//   function(err) {
//     console.log('Error', err);
//   },
// );
