const aws = require('aws-sdk');
const knex = require('knex');
const groupBy = require('lodash/groupBy');

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    database: 'carpedalan',
    user: 'postgres',
    password: 'postgres',
  },
});
const sqs = new aws.SQS({
  region: 'us-west-2',
});
async function main() {
  // const id = '6ada23c0-5cd4-11ea-b47e-df2ab18e69ff';
  // const key = 'original/IMG_20200302_101549_MP.jpg';
  const photos = await db('photos').select(['key', 'id']);
  // console.log(results);
  let promises = [];
  let results = [];
  const keyAndId = photos.map(({ key, id }, index) => ({ key, id, index }));
  const groups = groupBy(keyAndId, ({ index }) => Math.floor(index / 10));
  try {
    promises = Object.values(groups).map(arrayOfKeyIdObject =>
      sqs
        .sendMessageBatch({
          QueueUrl:
            'https://sqs.us-west-2.amazonaws.com/726278313509/carpedalan-prod2020-pgidqueue-815c532',
          Entries: arrayOfKeyIdObject.map(({ key, id }) => ({
            MessageBody: JSON.stringify({ key, id }),
            Id: id,
          })),
        })
        .promise(),
    );
    results = await Promise.all(promises);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  console.error('result', JSON.stringify(results, null, 2));
  process.exit(0);
}
main();
