const { env } = process;

export const publicPassword = env.PUBLIC_PASSWORD;
export const adminPassword = env.ADMIN_PASSWORD;
export const sessionSecret = env.SESSION_SECRET;
export const pgHost = env.PG_HOST;
export const pgUser = env.PG_USER;
export const pgPassword = env.PG_PASSWORD;
export const pgDatabase = env.PG_DATABASE;
export const port = env.PORT;
export const nodeEnv = env.NODE_ENV || 'development';
export const isProd = nodeEnv === 'production';
export const assets = ['runtime.js', 'vendors.js', 'client.js'];
export const bucket = env.S3_BUCKET;

// Optional
export const logLevel = env.LOG_LEVEL;
