const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';

const { database } = knexfile[env].connection;
exports.up = async knex => {
  await knex.raw(`CREATE DATABASE ${database}`);
};
exports.down = function(knex) {
  knex.dropDatabase('carpedalan');
};

exports.config = { transaction: false };
