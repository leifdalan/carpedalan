const { TAG_ID, PHOTOS_TAGS, ID, TAGS } = require('../../../shared/constants');

exports.up = async knex => {
  await knex.schema.table(PHOTOS_TAGS, t => {
    t.dropForeign(TAG_ID);
    t.foreign(TAG_ID)
      .references(ID)
      .inTable(TAGS)
      .onDelete('CASCADE');
  });
  await knex(TAGS)
    .where('name', 'peps')
    .orWhere('name', 'bath time')
    .orWhere('name', 'füd')
    .orWhere('name', 'dalan time')
    .orWhere('name', 'tummy time')
    .orWhere('name', 'uncle erin')
    .orWhere('name', 'unclejoe')
    .orWhere('name', 'jamz')
    .orWhere('name', 'space jams')
    .orWhere('name', 'bathtime')
    .delete();
  const { id } = await knex(TAGS)
    .select('id')
    .where('name', 'dealwithit')
    .first();
  const { id: badId } = await knex(TAGS)
    .select('id')
    .where('name', 'deal with it')
    .first();

  await knex(PHOTOS_TAGS)
    .update('tagId', id)
    .where('tagId', badId);

  await knex(TAGS)
    .where('name', 'deal with it')
    .delete();
};

exports.down = knex => knex.schema.dropTable('photos_tags');
