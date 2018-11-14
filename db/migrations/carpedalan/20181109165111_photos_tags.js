exports.up = knex =>
  knex.schema.createTable('photos_tags', table => {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v1mc()'));

    table.uuid('photoId');
    table
      .foreign('photoId')
      .references('id')
      .inTable('photos');
    table.uuid('tagId');

    table
      .foreign('tagId')
      .references('id')
      .inTable('tags');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('photos_tags');
