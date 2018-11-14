exports.up = knex =>
  knex.schema.createTable('tags', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.string('name');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

exports.down = knex => {
  knex.schema.dropTable('tags');
};
