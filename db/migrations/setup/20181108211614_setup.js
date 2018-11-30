const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';

const { database } = knexfile[env].connection;
exports.up = async knex => {
  await knex.raw('CREATE EXTENSION "dblink"');
  await knex.raw(`
  DO
$do$
BEGIN
   IF EXISTS (SELECT 1 FROM pg_database WHERE datname = '${database}') THEN
      RAISE NOTICE 'Database already exists'; 
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE ${database}');
   END IF;
END
$do$;
  `);
};
exports.down = function(knex) {
  knex.dropDatabase('carpedalan');
};

exports.config = { transaction: false };
