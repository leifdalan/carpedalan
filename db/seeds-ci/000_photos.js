// const { v4: uuid } = require('uuid');

// const data = require('../../goodDataWithEtagAndKey.json');
// const { ACTIVE } = require('../../shared/constants');

exports.seed = async knex => {
  await Promise.all([
    knex('photos_tags').del(),
    knex('tags').del(),
    knex('photos').del(),
  ]);
};
