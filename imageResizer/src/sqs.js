const { promisify } = require('util');

const knex = require('knex');
const redis = require('redis');

const { REDIS_URL } = process.env;
const { SIZES, EXIFPROPS } = require('./constants');

exports.sqs = async (event, context) => {};
