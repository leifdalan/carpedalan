// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const dotenv = require('dotenv-safe');
const knex = require('knex');
// const aws = require('aws-sdk');

const knexFile = require('../../db/knexfile');

const env = dotenv.config();
const config = knexFile.ci;
const db = knex(config);
console.log(env.parsed);

// const S3 = new aws.S3();

module.exports = (on, pluginConfig) => {
  on('task', {
    async cleanDb() {
      await db.seed.run();
      return null;
    },
    // async removeUpload() {
    //   await S3.deleteObject({
    //     Bucket: 'carpedev-west',
    //     Key: 'original/neildegrasse.jpg',
    //   }).promise();
    //   return null;
    // },
  });
  return Object.assign(pluginConfig, {
    env: env.parsed,
  });
};
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
