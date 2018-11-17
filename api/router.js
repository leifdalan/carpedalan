import express from 'express';
import { S3 } from 'aws-sdk';

import { publicPassword, adminPassword, bucket } from '../server/config';
import { READ_USER, WRITE_USER } from '../server/constants';
import { isLoggedIn } from '../server/middlewares';
import { IMAGES_PATH } from '../shared/constants';

import posts from './posts';
import tags from './tags';
// Create S3 interface object
const s3 = new S3();

const api = express.Router();

// Route the things
api.use('/posts', posts);
api.use('/tags', tags);

// Login route
api.post('/login', (req, res) => {
  if (req.body.password === publicPassword) {
    req.session.user = READ_USER;
  } else if (req.body.password === adminPassword) {
    req.session.user = WRITE_USER;
  } else {
    res.status(401).send();
  }
  res.status(200).send({ user: req.session.user });
});

// Proxy all image requests to private bucket
api.get(`${IMAGES_PATH}/original/:id`, isLoggedIn, async (req, res) => {
  const stream = await s3
    .getObject({
      Key: `original/${req.params.id}`,
      Bucket: bucket,
    })
    .createReadStream();
  stream.pipe(res);
});

export default api;
