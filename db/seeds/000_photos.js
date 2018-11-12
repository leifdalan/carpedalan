const { v4: uuid } = require('uuid');

const data = require('../../goodDataWithEtagAndKey.json');

exports.seed = async knex => {
  await knex('photos_tags').del();
  await knex('tags').del();
  await knex('photos').del();
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const datum of data) {
    const id = uuid();
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

    await knex('photos').insert({
      id,
      timestamp,
      date,
      originalUrl: url,
      width,
      height,
      description: summary,
      camera: Camera,
      ISO,
      aperture: Aperture,
      exposure: Exposure,
      focalLength: FocalLength,
      etag: s3,
      key,
    });
    for (const tag of tags) {
      if (tags.length) {
        const tagRecord = await knex('tags')
          .select()
          .where({
            name: tag,
          })
          .first();

        if (tagRecord) {
          await knex('photos_tags').insert({
            id: uuid(),
            tagId: tagRecord.id,
            photoId: id,
          });
        } else {
          const newTagRecord = await knex('tags').insert({
            id: uuid(),
            name: tag,
          });
          await knex('photos_tags').insert({
            id: uuid(),
            tagId: newTagRecord.id,
            photoId: id,
          });
        }
      }
    }
  }
};
