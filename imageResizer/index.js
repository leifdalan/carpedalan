/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved */

const sharp = require('sharp');
const aws = require('aws-sdk');
// const sqip = require('sqip');
// const knex = require('knex');

const { SIZES } = require('./constants');

const s3 = new aws.S3();

exports.handler = async (event, context, ...otherThingz) => {
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

  let buffer;

  try {
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
  let resized;
  try {
    console.time('sharp');
    const jpegPromises = SIZES.map(size =>
      sharp(buffer.Body)
        .resize({
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
        })
        .jpeg({ quality: 80 })
        .toBuffer(),
    );
    const webpPromises = SIZES.map(size =>
      sharp(buffer.Body)
        .resize({
          width: size.width,
          ...(size.height ? { height: size.height } : {}),
        })

        .webp({ quality: 80 })
        .toBuffer(),
    );
    resized = await Promise.all([...jpegPromises, ...webpPromises]);
  } catch (e) {
    console.log('sharp error', JSON.stringify(e));
  } finally {
    console.timeEnd('sharp');
  }
  let response;
  try {
    console.time('put');
    const withoutOriginal = key.split('/')[1];
    const withoutExtension = withoutOriginal.split('.')[0];
    const putPromises = resized.map((resize, index) => {
      const isJpeg = index < SIZES.length;
      const extension = isJpeg ? 'jpg' : 'webp';
      const contentType = isJpeg ? 'image/jpeg' : 'image/webp';
      const size = SIZES[index % 4];
      return s3
        .upload({
          Key: `web/${withoutExtension}-${size.width}${
            size.height ? `-${size.height}` : ''
          }.${extension}`,
          Bucket: bucket,
          Body: resize,
          ContentType: contentType,
        })
        .promise();
    });
    await Promise.all(putPromises);
  } catch (e) {
    console.log(e);
    console.log('upload error', JSON.stringify(e));
    throw e;
  } finally {
    console.timeEnd('put');
  }

  console.timeEnd('fire');
  return response;
};
