/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved */

const fs = require('fs');
const { promisify } = require('util');

const sharp = require('sharp');
const aws = require('aws-sdk');
const sqip = require('sqip');
const knex = require('knex');
const redis = require('redis');
const exif = require('exif-parser');

const {
  IS_LOCAL,
  PG_USER_SECRET_ID,
  PG_PASSWORD_SECRET_ID,
  PG_HOST,
  REDIS_URL,
} = process.env;
const { SIZES, EXIFPROPS } = require('./constants');

const secretManager = new aws.SecretsManager();
const extraBucketParams = IS_LOCAL
  ? {
      endpoint: `http://aws:4572`,
      s3ForcePathStyle: true,
    }
  : {};
const ACL = IS_LOCAL ? 'public-read' : 'private';

const s3 = new aws.S3(extraBucketParams);

exports.imageResizer = async (event, context, ...otherThingz) => {
  let pgUri;
  if (IS_LOCAL) {
    pgUri = 'postgres://postgres:postgres@pg:5432/carpedalan';
  } else {
    console.time('Getting Secrets');
    const userPromise = secretManager
      .getSecretValue({
        SecretId: PG_USER_SECRET_ID,
      })
      .promise();
    const passwordPromise = secretManager
      .getSecretValue({
        SecretId: PG_PASSWORD_SECRET_ID,
      })
      .promise();

    const [userResponse, passwordResponse] = await Promise.all([
      userPromise,
      passwordPromise,
    ]);
    const { SecretString: user } = userResponse;
    const { SecretString: password } = passwordResponse;
    console.log('PG USER', user);
    pgUri = `postgres://${user}:${password}@${PG_HOST}/carpedalan`;
    console.timeEnd('Getting Secrets');
  }

  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  console.time('fire');
  console.log('EVENT=============');
  console.log(JSON.stringify(event));
  console.log('CONTEXT ==========================================');
  console.log(JSON.stringify(context));
  console.log('rest==========================================');
  console.log(JSON.stringify(otherThingz));
  const key = event.Records[0].s3.object.key;
  const bucket = event.Records[0].s3.bucket.name;
  console.error('bucket', bucket);
  console.error('sizes', SIZES);
  let resized;
  let buffer;
  try {
    console.log('hello?');
    console.time('s3');
    buffer = await s3
      .getObject({
        Key: key,
        Bucket: bucket,
      })
      .promise();
    console.log('buffer', buffer);
  } catch (e) {
    console.log('getObject error', JSON.stringify(e));
  } finally {
    console.timeEnd('s3');
  }
  // / TODO CHECK METADATA FOR ROTATE HERE

  console.log('rotate', buffer.Metadata.rotate);

  let rotated;
  let exifData;
  try {
    const parser = exif.create(buffer.Body);
    exifData = parser.parse();
    console.log('exifData', exifData);
  } catch (e) {
    console.log('exif error', e);
  }
  const rotate = buffer.Metadata.rotate
    ? Number(buffer.Metadata.rotate) + (exifData.Orientation === 6 ? 90 : 0)
    : null;
  try {
    console.time('sharp');
    rotated = await sharp(buffer.Body)
      .rotate(rotate)
      .toBuffer();
    const jpegPromises = SIZES.map(size =>
      sharp(rotated)
        .resize({
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
        })
        .jpeg({ quality: 80 })
        .toBuffer(),
    );
    const webpPromises = SIZES.map(size =>
      sharp(rotated)
        .resize({
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
        })

        .webp({ quality: 80 })
        .toBuffer(),
    );
    resized = await Promise.all([...jpegPromises, ...webpPromises]);
  } catch (e) {
    console.log('sharp error', e);
  } finally {
    console.timeEnd('sharp');
  }
  let response;
  const withoutOriginal = key.split('/')[1];
  const withoutExtension = withoutOriginal.split('.')[0];
  const rotateString = rotate ? `-${rotate}` : '';
  try {
    console.time('put');

    const putPromises = resized.map((resize, index) => {
      const isJpeg = index < SIZES.length;
      const extension = isJpeg ? 'jpg' : 'webp';
      const contentType = isJpeg ? 'image/jpeg' : 'image/webp';
      const size = SIZES[index % SIZES.length];
      return s3
        .upload({
          Key: `web/${withoutExtension}${rotateString}-${size.width}${
            size.height ? `-${size.height}` : ''
          }.${extension}`,
          Bucket: bucket,
          Body: resize,
          ContentType: contentType,
          ACL,
        })
        .promise();
    });

    const rotatedOriginalPromise = s3
      .upload({
        Key: `original/${withoutExtension}${rotateString}.jpg`,
        Bucket: bucket,
        Body: rotated,
        ContentType: 'image/jpeg',
        ACL,
      })
      .promise();
    await Promise.all([...putPromises, rotatedOriginalPromise]);
  } catch (e) {
    console.log(e);
    console.log('upload error', JSON.stringify(e));
    throw e;
  } finally {
    console.timeEnd('put');
  }

  // Update record
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
  } catch (e) {
    console.log('PG error', e);
  }
  if (pgResponse) {
    try {
      console.time('sqip');
      const client = redis.createClient({
        url: REDIS_URL,
      });
      const set = promisify(client.set).bind(client);
      fs.writeFileSync(`/tmp/${withoutOriginal}`, resized[2], 'utf8');
      const result = sqip({
        filename: `/tmp/${withoutOriginal}`,
        numberOfPrimitives: 25,
      });
      console.timeEnd('sqip');

      console.error('result', result.final_svg);
      console.error('pgResponse[0].id', pgResponse[0].id);

      const stuff = await set(pgResponse[0].id, result.final_svg);
      console.error('stuff', stuff);
    } catch (e) {
      console.log('SQIP Error', e);
    }
  }

  console.timeEnd('fire');
  return response;
};
