import knex from 'knex';

import knexFile from '../db/knexfile';

import { nodeEnv } from './config';

console.error('nodeEnv', nodeEnv);

const config = knexFile[nodeEnv];
const db = knex(config);
export default db;
