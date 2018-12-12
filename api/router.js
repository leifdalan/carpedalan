import express from 'express';
import { S3 } from 'aws-sdk';

import { publicPassword, adminPassword, bucket } from '../server/config';
import { READ_USER, WRITE_USER } from '../server/constants';
import { isLoggedIn } from '../server/middlewares';
import { IMAGES_PATH } from '../shared/constants';
import log from '../src/utils/log';

import posts from './posts';
import tags from './tags';

// Create S3 interface object
const s3 = new S3();

const api = express.Router();

// // Route the things
api.use('/posts', posts);
api.use('/tags', tags);

// Login route
api.post('/login', (req, res) => {
  if (req.body.password === publicPassword) {
    req.session.user = READ_USER;
    res.status(200).send({ user: req.session.user });
  } else if (req.body.password === adminPassword) {
    req.session.user = WRITE_USER;
    res.status(200).send({ user: req.session.user });
  } else {
    res.status(401).send();
  }
});

api.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Proxy all image requests to private bucket
api.get(`${IMAGES_PATH}/:size/:id`, isLoggedIn, async (req, res) => {
  const withoutExtension = req.params.id.split('.')[0];

  const stream = await s3
    .getObject({
      Key: `web/${withoutExtension}-${req.params.size}.webp`,
      Bucket: bucket,
    })
    .createReadStream()
    .on('error', async error => {
      log.error(error, 'error');
      try {
        const originalStream = s3 // try and get original
          .getObject({
            Key: `original/${withoutExtension}.jpg`,
            Bucket: bucket,
          })
          .createReadStream()
          .on('error', e => {
            // No original, send 404.
            log.info('error', e);
            res.status(404).send();
          });
        // Equivalent to a "touch" in s3; will trigger any lambda
        // listening for putObject, namely our image resizer
        await s3
          .copyObject({
            Key: `original/${withoutExtension}.jpg`,
            CopySource: `${bucket}/original/${withoutExtension}.jpg`,
            Bucket: bucket,
            MetadataDirective: 'REPLACE',
          })
          .promise();

        // Give the original for now
        originalStream.pipe(res);
      } catch (e) {
        // This catch is for the s3 touch
        res.status(500).send(e);
      }
      // throw err;
    });

  // Stream the reized version since there are no errors
  stream.pipe(res);
});

export default api;
