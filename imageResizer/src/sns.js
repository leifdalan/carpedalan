/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved,no-unused-vars */
const { promisify } = require('util');

const knex = require('knex');
const redis = require('redis');

const { REDIS_URL } = process.env;
const { SIZES, EXIFPROPS } = require('./constants');

exports.sns = async (event, context) => {
  console.log('it worked', event.Records[0].Sns.Message, context);
  let message = {};
  try {
    message = JSON.parse(event.Records[0].Sns.Message);
    console.error('message', message);
  } catch (e) {
    console.error(e);
  }
  const {
    exifData,
    withoutExtension,
    withoutOriginal,
    pgUri,
    rotateString,
    svg,
  } = message;
  let pgResponse;
  try {
    const validExifData = Object.keys(EXIFPROPS).reduce(
      (acc, exifKey) => ({
        ...acc,
        ...(exifData.tags[exifKey]
          ? { [EXIFPROPS[exifKey]]: exifData.tags[exifKey] }
          : {}),
      }),
      {},
    );
    const db = knex({
      client: 'pg',
      connection: pgUri,
      pool: {
        min: 2,
        max: 10,
      },
    });
    console.log(validExifData);
    console.log(withoutOriginal);
    // Check for bad exif
    // const success = false;
    console.error(`original/${withoutExtension}${rotateString}.jpg`);

    let updateClause = {
      key: `original/${withoutExtension}${rotateString}.jpg`,
    };
    if (!exifData || !exifData.tags) {
      updateClause = {
        isPending: true,
      };
    } else if (
      !exifData.tags.DateTimeOriginal ||
      !exifData.tags.ImageHeight ||
      !exifData.tags.ImageWidth
    ) {
      updateClause = {
        isPending: true,
      };
    } else {
      updateClause = {
        timestamp: exifData.tags.DateTimeOriginal,
        status: 'active',
        isPending: false,
        ...validExifData,
      };
    }

    pgResponse = await db('photos')
      .update(updateClause)
      .where('key', `original/${withoutOriginal}`)
      .returning('*');
    console.log('pgResponse', pgResponse);
    db.destroy((...args) => {
      console.log('Destroyed.', args);
    });
  } catch (e) {
    console.log('PG error', e);
  }

  try {
    console.time('sqip');
    const client = redis.createClient({
      url: REDIS_URL,
    });

    const set = promisify(client.set).bind(client);
    console.error('pgResponse[0].id', pgResponse[0].id);

    const stuff = await set(pgResponse[0].id, svg);

    console.error('stuff', stuff);
  } catch (e) {
    console.error('redis error', e);
  }

  return {
    statusCode: 200,
    message: pgResponse[0].id,
  };
};
