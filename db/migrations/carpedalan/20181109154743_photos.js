exports.up = knex =>
  knex.schema.createTable('photos', table => {
    table.uuid('id').primary();
    table.integer('timestamp');
    table.date('date');
    table.string('originalUrl');
    table.integer('width');
    table.integer('height');
    table.string('description');
    table.string('camera');
    table.string('ISO');
    table.string('aperture');
    table.string('exposure');
    table.string('focalLength');
    table.string('etag');
    table.string('key');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

exports.down = knex => {
  knex.schema.dropTable('photos');
};
