exports.up = knex =>
  knex.schema.createTable('photos_tags', table => {
    table.uuid('id').primary();
    table
      .uuid('photoId')
      .references('id')
      .inTable('photos');
    table
      .uuid('tagId')
      .references('id')
      .inTable('tags');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTable('photos_tags');
