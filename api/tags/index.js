import express from 'express';

import db from '../../server/db';
import { isAdmin, isLoggedIn } from '../../server/middlewares';
import {
  ACTIVE,
  ID,
  NAME,
  PHOTO_ID,
  PHOTOS_TAGS,
  TAG_ID,
  TAGS,
  TIMESTAMP,
} from '../../shared/constants';

const tags = express.Router();

tags.get('/:tag', isLoggedIn, async (req, res) => {
  // Get all photos by tag name
  const order = req.query.order || 'desc';
  const as = 'photoz';
  const tagName = 'tagName';
  const tagId = 'tagId';

  const selectStatement = db
    .select('photos.*', 'tags.name as tagName', 'tags.id as tagId')
    .from('photos')
    .leftJoin('photos_tags', 'photos_tags.photoId', 'photos.id')
    .leftJoin('tags', 'tags.id', 'photos_tags.tagId')
    .orderBy('timestamp', 'desc')
    .where({
      'tags.name': req.params.tag,
      'photos.status': ACTIVE,
    })
    .as(as);

  const photos = await db
    .select(
      `${as}.*`,
      `${TAGS}.${NAME} as ${tagName}`,
      `${TAGS}.${ID} as ${tagId}`,
    )
    .from(selectStatement)
    .leftJoin(PHOTOS_TAGS, `${PHOTOS_TAGS}.${PHOTO_ID}`, `${as}.${ID}`)
    .leftJoin(TAGS, `${TAGS}.${ID}`, `${PHOTOS_TAGS}.${TAG_ID}`)
    .orderBy(`${as}.${TIMESTAMP}`, order);

  // Combine tag entries with the same photo id
  const dedupped = photos.reduce((acc, photo) => {
    const existing = acc.find(({ id }) => id === photo[ID]);
    if (existing) {
      if (photo[tagId]) {
        existing.tags.push({
          id: photo[tagId],
          name: photo[tagName],
        });
      }
      return acc;
    }
    return [
      ...acc,
      {
        ...photo,
        tags: photo[tagId] ? [{ id: photo[tagId], name: photo[tagName] }] : [],
        [tagName]: undefined,
        [tagId]: undefined,
      },
    ];
  }, []);

  res.status(200).send({
    data: dedupped,
    meta: { count: dedupped.length },
  });
});

tags.get('/', isLoggedIn, async (req, res) => {
  const tagsResponse = await db('tags').select();
  const counts = await db('photos_tags')
    .select('tagId')
    .count('*')
    .groupBy('tagId');

  const countsById = counts.reduce(
    (acc, count) => ({
      ...acc,
      [count.tagId]: count.count,
    }),
    {},
  );

  const withCount = tagsResponse.map(tag => ({
    ...tag,
    count: countsById[tag.id],
  }));
  res.status(200).send(withCount);
});

tags.post('/', isAdmin, async (req, res) => {
  try {
    const [tagsResponse] = await db('tags')
      .insert({ name: req.body.tag })
      .returning('*');
    res.status(200).send(tagsResponse);
  } catch (e) {
    res.status(500).send(e);
  }
});

export default tags;
