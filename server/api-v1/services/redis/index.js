const { promisify } = require('util');

const redis = require('redis');

const { redisUrl } = require('../../../config');

const client = redis.createClient({
  url: redisUrl,
});

const get = promisify(client.get).bind(client);
const mget = promisify(client.mget).bind(client);
const set = promisify(client.set).bind(client);

export default { set, get, mget, client };
