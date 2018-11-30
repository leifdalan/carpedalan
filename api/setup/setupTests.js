

const path = require('path');

const dotenv = require('dotenv');
const knex = require('knex');
const config = require('../../db/knexfile');
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
const connection = knex(config.test);
beforeEach(async () => {
  await connection.seed.run();
})