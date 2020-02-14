import path from 'path';

import dotenv from 'dotenv-safe';

let { env } = process;

if (env.NODE_ENV === 'ci') {
  env = dotenv.config({ path: path.resolve(process.cwd(), '.env.ci') }).parsed;
}

export const branch = env.CI_COMMIT_REF_NAME;
export const buildNum = env.CI_JOB_ID;
export const sha1 = env.CI_COMMIT_SHA;
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
export const pgUri =
  env.PG_URI ||
  `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`;
export const assets = ['runtime.js', 'vendors.js', 'client.js'];
export const bucket = env.S3_BUCKET;
export const ssl = env.PGSSLMODE === 'require';
export const ci = env.CI === 'true';
export const skipCf = env.SKIP_CF === 'true';
// Optional
export const logLevel = env.LOG_LEVEL === 'info';
export const cdnDomain = env.CDN_DOMAIN;
export const assetDomain = env.ASSET_CDN_DOMAIN;
export const domain = env.DOMAIN;
export const awsAccessKeyId = env.AWS_ACCESS_KEY_ID;
export const awsRegion = env.AWS_DEFAULT_REGION;
export const awsSecretAccessKey = env.AWS_SECRET_ACCESS_KEY;
export const cfKey = env.CLOUDFRONT_KEY_ID;
export const secureCookie = isProd || isDev;
export const privateKey = env.PRIVATE_KEY;
export const useProdAssets = env.PROD_BUILD === 'true' || isProd;
