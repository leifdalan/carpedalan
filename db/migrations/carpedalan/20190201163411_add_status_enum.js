const { IS_PENDING } = require('../../../shared/constants');

exports.up = knex =>
  knex.schema.table('photos', table => {
    table.bool(IS_PENDING).defaultTo(false);
  });

exports.down = knex => {
  knex.schema.dropTable('photos');
};
