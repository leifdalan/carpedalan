import express from 'express';

import db from '../../server/db';
import { isLoggedIn } from '../../server/middlewares';

const tags = express.Router();

tags.get('/:tag', isLoggedIn, async (req, res) => {
  // Get all photos by tag name
  const photos = await db
    .select('photos.*', 'tags.name as tagName', 'tags.id as tagId')
    .from('photos')
    .leftJoin('photos_tags', 'photos_tags.photoId', 'photos.id')
    .leftJoin('tags', 'tags.id', 'photos_tags.tagId')
    .orderBy('timestamp', 'desc')
    .where({
      'tags.name': req.params.tag,
    });

  res.status(200).send({
    data: photos,
    meta: { count: photos.length },
  });
});

tags.get('/', isLoggedIn, async (req, res) => {
  const tagsResponse = await db('tags').select();
  res.status(200).send(tagsResponse);
});

export default tags;
