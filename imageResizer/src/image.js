/* eslint-disable import/no-extraneous-dependencies,prefer-destructuring,no-console,import/no-unresolved */

const fs = require('fs');

const sharp = require('sharp');
const aws = require('aws-sdk');
const sqip = require('sqip');
const exif = require('exif-parser');

const {
  IS_LOCAL,
  PG_USER_SECRET_ID,
  PG_PASSWORD_SECRET_ID,
  PG_HOST,
  TOPIC_ARN,
} = process.env;
const { SIZES } = require('./constants');

const sns = new aws.SNS();
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
  console.error('event', event);

  if (IS_LOCAL) {
    pgUri = 'postgres://postgres:postgres@pg:5432/postgres';
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

  try {
    console.time('sqip');
    fs.writeFileSync(`/tmp/${withoutOriginal}`, resized[2], 'utf8');
    const result = sqip({
      filename: `/tmp/${withoutOriginal}`,
      numberOfPrimitives: 25,
    });
    console.timeEnd('sqip');
    if (!IS_LOCAL) {
      const something = await sns
        .publish({
          Message: JSON.stringify({
            svg: result.final_svg,
            pgUri,
            whereClause: `original/${withoutOriginal}`,
            exifData,
            withoutExtension,
            withoutOriginal,
            rotateString,
          }),
          TopicArn: TOPIC_ARN,
        })
        .promise();
      console.error('something', something);

      console.error('result', result.final_svg);
    } else {
      // Message to be sent to fake SNS (local file)
      return {
        Records: [
          {
            Sns: {
              Message: JSON.stringify({
                svg: result.final_svg,
                pgUri,
                whereClause: `original/${withoutOriginal}`,
                exifData,
                withoutExtension,
                withoutOriginal,
                rotateString,
              }),
            },
          },
        ],
      };
    }
  } catch (e) {
    console.log('SQIP Error', e);
  }

  console.timeEnd('fire');
  return {
    statusCode: 404,
    body: 'hello',
  };
};
