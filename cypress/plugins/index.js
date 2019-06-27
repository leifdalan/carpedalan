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

const dotenv = require('dotenv-safe'); // eslint-disable-line
const env = dotenv.config();
const knex = require('knex');
const aws = require('aws-sdk');

const knexFile = require('../../db/knexfile');

const config = knexFile.e2e;
const db = knex(config);

const S3 = new aws.S3({ region: 'us-west-2' });

module.exports = (on, pluginConfig) => {
  on('task', {
    async cleanDb() {
      try {
        await db.seed.run();
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
        throw e;
      }
      return null;
    },
    async removeUpload() {
      try {
        await S3.deleteObject({
          Bucket: 'carpedalan-photos',
          Key: 'original/kitty2.jpg',
        }).promise();
        await S3.deleteObject({
          Bucket: 'carpedalan-photos',
          Key: 'original/kitty.jpg',
        }).promise();
      } catch (e) {
        throw e;
      }
      return null;
    },
  });
  return Object.assign(pluginConfig, {
    env: env.parsed,
  });
};
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config
