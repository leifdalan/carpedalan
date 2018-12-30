const { v4: uuid } = require('uuid');

const data = require('../../goodDataWithEtagAndKey.json');
const { ACTIVE, EXIFPROPS } = require('../../shared/constants');

exports.seed = async knex => {
  await Promise.all([
    knex('photos_tags').del(),
    knex('tags').del(),
    knex('photos').del(),
  ]);
  const photoInserts = [];
  const photoTagInserts = [];
  const tagInserts = [];

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const datum of data) {
    const {
      timestamp,
      date,
      url,
      width,
      height,
      summary,
      // exif: { Camera, ISO, Aperture, Exposure, FocalLength } = {
      //   Camera: null,
      //   ISO: null,
      //   Aperture: null,
      //   Exposure: null,
      //   FocalLength: null,
      // },
      tags,
      s3,
      key,
    } = datum;
    const id = uuid();
    const exifData = Object.keys(EXIFPROPS).reduce((acc, key) => {
      return {

        ...acc,
        [key]: datum.exif ? datum.exif[key]: null
      }
    }, {});
    
    photoInserts.push({
      id,
      timestamp,
      date,
      originalUrl: url,
      width,
      height,
      description: summary,
      // camera: Camera,
      // ISO,
      // aperture: Aperture,
      // exposure: Exposure,
      // focalLength: FocalLength,

      etag: s3,
      key,
      status: ACTIVE,
      // ...exifData,
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
