const { IS_PENDING, PHOTOS, TIMESTAMP } = require('../../../shared/constants');

exports.up = knex =>
  knex(PHOTOS)
    .update({
      [IS_PENDING]: true,
    })
    .where({ [TIMESTAMP]: null })
    .orWhere({
      imageHeight: null,
    })
    .orWhere({
      imageWidth: null,
    });

exports.down = knex => {
  knex.schema.dropTable('photos');
};
