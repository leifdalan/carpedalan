const {
  ID,
  TIMESTAMP,
  DATE,
  ORIGINALURL,
  WIDTH,
  HEIGHT,
  DESCRIPTION,
  CAMERA,
  ISO,
  APERTURE,
  EXPOSURE,
  // FOCALLENGTH,
  ETAG,
  KEY,
  CREATEDAT,
  UPDATEDAT,
  STATUS,
  ACTIVE,
  DELETED,
  EXIFPROPS,
} = require('../../../shared/constants');

exports.up = knex =>
  knex.schema.createTable('photos', table => {
    table
      .uuid(ID)
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.integer(TIMESTAMP);
    table.date(DATE);
    table.string(ORIGINALURL);
    table.integer(WIDTH);
    table.integer(HEIGHT);
    table.string(DESCRIPTION);
    table.string(CAMERA);
    table.string(ISO);
    table.string(APERTURE);
    table.string(EXPOSURE);
    table.string(ETAG);
    table.string(KEY);
    table.enu(STATUS, [ACTIVE, DELETED]).defaultTo(ACTIVE);
    table.timestamp(CREATEDAT).defaultTo(knex.fn.now());
    table.timestamp(UPDATEDAT).defaultTo(knex.fn.now());
    Object.values(EXIFPROPS).forEach(value => {
      table.string(value);
    });
  });

exports.down = knex => {
  knex.schema.dropTable('photos');
};
