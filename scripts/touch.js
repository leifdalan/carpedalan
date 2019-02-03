const knex = require('knex');
const { S3 } = require('aws-sdk');

const farts = new S3({ region: 'us-west-2', profile: 'carpedev' });

const db = knex({
  client: 'pg',
  connection:
    'postgres://carpedalan:mzUPWgCocjLc8nZzseyAiaYvNamJsaavTtUNekRCFaETBhrQmMedad@carpedalan.ch0mtd934f8e.us-east-1.rds.amazonaws.com:5432/carpedalan',
  pool: {
    min: 2,
    max: 200,
  },
});

async function doThing() {
  const result = await db('photos')
    .select('key')
    .where({ isPending: true });
  const keys = result.reduce(
    (acc, obj) => [...acc, `raw/${obj.key.split('/')[1]}`],
    [],
  );
  console.error('keys', keys);
  const errors = [];
  /* eslint-disable */
  for (special of keys) {
    console.error('special', special);
    console.error('`/carpedev-west/${special}`', `/carpedev-west/${special}`);
    
    try {

      await farts
        .copyObject({
          Key: special,
          CopySource: `carpedev-west/${special}`,
          Bucket: 'carpedev-west',
          MetadataDirective: 'REPLACE',
        })
        .promise();
  } catch(e) {
    console.log('this failed', e)
    errors.push(e);
  }
  console.log(errors)
}
}

// // Equivalent to a "touch" in s3; will trigger any lambda
// // listening for putObject, namely our image resizer
// await s3
//   .copyObject({
//     Key: `original/${withoutExtension}.jpg`,
//     CopySource: `${bucket}/original/${withoutExtension}.jpg`,
//     Bucket: bucket,
//     MetadataDirective: 'REPLACE',
//   })
//   .promise();

doThing();
