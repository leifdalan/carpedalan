const { env } = process;

export default {
  publicPassword: env.PUBLIC_PASSWORD,
  adminPassword: env.ADMIN_PASSWORD,
  sessionSecret: env.SESSION_SECRET,
};
