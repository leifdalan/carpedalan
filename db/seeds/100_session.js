exports.seed = async knex => {
  knex('session').insert({
    sid: '0cI2SVbI3vvyO-vxyQGPZ-ojs6o5CP33',
    sess:
      '{"cookie":{"originalMaxAge":2592000,"expires":"2019-11-11T04:36:49.408Z","httpOnly":true,"path":"/"},"user":"read"}',
    expire: '2019-11-11 05:12:37',
  });
};
