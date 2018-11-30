// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'pg',
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/setup',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
      port: 5555,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './db/migrations/setup',
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/setup',
    },
  },

  production: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/setup',
    },
  },
};
