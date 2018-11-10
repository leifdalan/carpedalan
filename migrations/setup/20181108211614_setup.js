const knexfile = require('../../db/knexfile');

const env = process.env.NODE_ENV || 'development';

const { database, user, password } = knexfile[env];
exports.up = knex =>
  knex
    .raw(`CREATE DATABASE ${database}`)
    .then(() =>
      knex.raw(`CREATE USER ${user} WITH ENCRYPTED PASSWORD '${password}'`),
    )
    .then(() =>
      knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${user}`),
    );
exports.down = function(knex) {
  knex.dropDatabase('carpedalan');
};

exports.config = { transaction: false };
