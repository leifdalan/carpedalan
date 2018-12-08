import path from 'path';

import dotenv from 'dotenv-safe';

let { env } = process;
if (env.NODE_ENV === 'test' && !env.WALLABY) {
  env = dotenv.config({
    path: '.env.test',
    example: '.env.example',
  }).parsed;
}
if (env.NODE_ENV === 'ci') {
  env = dotenv.config({ path: path.resolve(process.cwd(), '.env.ci') }).parsed;
}
export const publicPassword = env.PUBLIC_PASSWORD;
export const adminPassword = env.ADMIN_PASSWORD;
export const sessionSecret = env.SESSION_SECRET;
export const pgHost = env.PG_HOST;
export const pgUser = env.PG_USER;
export const pgPort = env.PG_PORT;
export const pgPassword = env.PG_PASSWORD;
export const pgDatabase = env.PG_DATABASE;
export const port = env.PORT;
export const nodeEnv = env.NODE_ENV || 'development';
export const isProd = nodeEnv === 'production';
export const isDev = nodeEnv === 'development';

export const assets = ['runtime.js', 'vendors.js', 'client.js'];
export const bucket = env.S3_BUCKET;
// Optional
export const logLevel = env.LOG_LEVEL === 'info';
