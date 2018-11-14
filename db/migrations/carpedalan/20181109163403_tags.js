const {
  ID,
  TAGS,
  CREATEDAT,
  UPDATEDAT,
  NAME,
} = require('../../../shared/constants');

exports.up = knex =>
  knex.schema.createTable(TAGS, table => {
    table
      .uuid(ID)
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.string(NAME);
    table.timestamp(CREATEDAT).defaultTo(knex.fn.now());
    table.timestamp(UPDATEDAT).defaultTo(knex.fn.now());
  });

exports.down = knex => {
  knex.schema.dropTable(TAGS);
};
