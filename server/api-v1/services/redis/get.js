const { promisify } = require('util');

const redis = require('redis');

const client = redis.createClient({
  host: 'redis',
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

export default get;
