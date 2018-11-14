const {
  PHOTO_ID,
  TAG_ID,
  PHOTOS_TAGS,
  ID,
  PHOTOS,
  TAGS,
  CREATEDAT,
  UPDATEDAT,
} = require('../../../shared/constants');

exports.up = knex =>
  knex.schema.createTable(PHOTOS_TAGS, table => {
    table
      .uuid(ID)
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid(PHOTO_ID);
    table
      .foreign(PHOTO_ID)
      .references(ID)
      .inTable(PHOTOS);
    table.uuid(TAG_ID);

    table
      .foreign(TAG_ID)
      .references(ID)
      .inTable(TAGS);
    table.timestamp(CREATEDAT).defaultTo(knex.fn.now());
    table.timestamp(UPDATEDAT).defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('photos_tags');
