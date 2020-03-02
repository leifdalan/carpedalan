const { promisify } = require('util');

const redis = require('redis');

const client = redis.createClient({
  host: 'redis',
});

const get = promisify(client.get).bind(client);

export default get;
