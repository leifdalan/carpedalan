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
