const { v4: uuid } = require('uuid');

/* eslint-disable no-restricted-syntax,no-await-in-loop,import/no-unresolved */
const data = require('../../goodDataWithEtagAndKey.json');
const { ACTIVE } = require('../../shared/constants');

exports.seed = async knex => {
  await knex('photos_tags').del();
  await Promise.all([knex('tags').del(), knex('photos').del()]);
  const photoInserts = [];
  const photoTagInserts = [];
  const tagInserts = [];
  /* eslint-disable no-restricted-syntax,no-await-in-loop */
  for (const datum of data) {
    const {
      timestamp,
      date,
      url,
      width,
      height,
      summary,
      exif: { Camera, ISO, Aperture, Exposure, FocalLength } = {
        Camera: null,
        ISO: null,
        Aperture: null,
        Exposure: null,
        FocalLength: null,
      },
      tags,
      s3,
      key,
    } = datum;
    const id = uuid();

    photoInserts.push({
      id,
      timestamp,
      date,
      originalUrl: url,
      description: summary,
      etag: s3,
      key,
      status: ACTIVE,
      make: Camera,
      model: Camera,
      apertureValue: Aperture,
      exposureTime: Exposure,
      focalLength: FocalLength,
      imageHeight: height,
      imageWidth: width,
      ISO,
    });
    for (const tag of tags) {
      if (tags.length) {
        const tagRecord = tagInserts.find(({ name }) => name === tag);
        if (tagRecord) {
          photoTagInserts.push({
            tagId: tagRecord.id,
            photoId: id,
          });
        } else {
          const tagId = uuid();
          tagInserts.push({
            name: tag,
            id: tagId,
          });
          photoTagInserts.push({
            tagId,
            photoId: id,
          });
        }
      }
    }
  }
  await Promise.all([
    knex('photos').insert(photoInserts),
    knex('tags').insert(tagInserts),
  ]);
  await knex('photos_tags').insert(photoTagInserts);
};
