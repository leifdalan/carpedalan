import express from 'express';
import { S3 } from 'aws-sdk';

import { publicPassword, adminPassword, bucket } from '../server/config';
import { READ_USER, WRITE_USER } from '../server/constants';
import db from '../server/db';
import { isLoggedIn } from '../server/middlewares';
import { IMAGES_PATH } from '../shared/constants';

const api = express.Router();
const s3 = new S3();
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

api.get('/posts', isLoggedIn, async (req, res) => {
  const selectStatement = db('photos')
    .select()
    .orderBy('date', 'desc')
    .limit(50)
    .as('photoz');
  const photos = await db
    .select('photoz.*', 'tags.name as tagName', 'tags.id as tagId')
    .from(selectStatement)
    .leftJoin('photos_tags', 'photos_tags.photoId', 'photoz.id')
    .leftJoin('tags', 'tags.id', 'photos_tags.tagId');

  const dedupped = photos.reduce((acc, photo) => {
    const existing = acc.find(({ id }) => id === photo.id);
    if (existing) {
      if (photo.tagId) {
        existing.tags.push({
          id: photo.tagId,
          name: photo.tagName,
        });
      }
      return acc;
    }
    return [
      ...acc,
      {
        ...photo,
        tags: photo.tagId ? [{ id: photo.tagId, name: photo.tagName }] : [],
        tagName: undefined,
        tagId: undefined,
      },
    ];
  }, []);

  res.json(dedupped).send();
});

api.get(`${IMAGES_PATH}/original/:id`, isLoggedIn, async (req, res) => {
  const stream = await s3
    .getObject({
      Key: `original/${req.params.id}`,
      Bucket: bucket,
    })
    .createReadStream();
  stream.pipe(res);
});

api.get('/tag/:tag', isLoggedIn, async (req, res) => {
  const photos = await db
    .select('photos.*', 'tags.name as tagName', 'tags.id as tagId')
    .from('photos')
    .leftJoin('photos_tags', 'photos_tags.photoId', 'photos.id')
    .leftJoin('tags', 'tags.id', 'photos_tags.tagId')
    .orderBy('date', 'desc')
    .where({
      'tags.name': req.params.tag,
    });

  res.status(200).send(photos);
});

export default api;
