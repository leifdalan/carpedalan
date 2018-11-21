exports.seed = async knex => {
  await knex('session').del();
  await knex('session').insert({
    sid: 'l13eX2h-tV9pGH5FHbbCG8AZvX3JZ-cu',
    sess:
      '{"cookie":{"originalMaxAge":155520000000,"expires":"2023-10-18T19:37:26.729Z","httpOnly":true,"path":"/"},"user":"write"}',
    expire: '2023-10-18 19:37:45',
  });
};
