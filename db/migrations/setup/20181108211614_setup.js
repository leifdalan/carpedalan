const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';

const { database } = knexfile[env].connection;
exports.up = knex => knex.raw(`CREATE DATABASE ${database}`);
exports.down = function(knex) {
  knex.dropDatabase('carpedalan');
};

exports.config = { transaction: false };
