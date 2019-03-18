import AWS from 'aws-sdk';
import express from 'express';
import omit from 'lodash/omit';

import { bucket } from '../../server/config';
import db from '../../server/db';
import { isLoggedIn, isAdmin } from '../../server/middlewares';
import {
  ACTIVE,
  DEFAULT_POSTS_PER_PAGE,
  DELETED,
  DESCRIPTION,
  ID,
  KEY,
  NAME,
  PHOTO_ID,
  PHOTOS,
  PHOTOS_TAGS,
  STATUS,
  TAG_ID,
  TAGS,
  TIMESTAMP,
  IS_PENDING,
} from '../../shared/constants';
import log from '../../src/utils/log';

import upload from './upload';

const posts = express.Router();
const s3 = new AWS.S3();

posts.use('/upload', upload);

posts.delete('/bulk', isAdmin, async (req, res) => {
  const { ids } = req.body;
  try {
    await db.transaction(async trx => {
      try {
        await trx(PHOTOS)
          .update({
            [STATUS]: DELETED,
          })
          .whereIn('id', ids);
      } catch (e) {
        throw e;
      }
    });
    return res.status(204).json();
  } catch (e) {
    return res.status(422).json(e);
  }
});

posts.patch('/bulk', isAdmin, async (req, res) => {
  const { ids, tags, description } = req.body;
  try {
    const photosTagsInsert = ids.reduce((acc, photoId) => {
      const photoTags = (tags || []).map(tagId => ({
        photoId,
        tagId,
      }));
      return [...acc, ...photoTags];
    }, []);
    await db.transaction(async trx => {
      try {
        if (description) {
          await trx(PHOTOS)
            .update({
              [DESCRIPTION]: description,
            })
            .whereIn('id', ids);
        }
        await trx(PHOTOS_TAGS).insert(photosTagsInsert);
      } catch (e) {
        throw e;
      }
    });
    return res.status(200).json();
  } catch (e) {
    return res.status(422).json(e);
  }
});

posts.delete('/:id', isAdmin, async (req, res) => {
  try {
    const response = await db('photos')
      .update({ [STATUS]: DELETED })
      .where({ id: req.params.id });
    res.status(204).json(response);
  } catch (e) {
    res.status(404).send();
    log.error(e);
  }
});

posts.patch('/:id', isAdmin, async (req, res) => {
  let photoResponse;
  let tags = [];
  const body = omit(req.body, ['tags', 'rotate', 'key']);

  if (req.body.rotate) {
    try {
      await s3
        .copyObject({
          Bucket: bucket,
          Key: `raw/${req.body.key.split('/')[1]}`,
          CopySource: `${bucket}/raw/${req.body.key.split('/')[1]}`,
          Metadata: {
            rotate: `${req.body.rotate}`,
          },
          MetadataDirective: 'REPLACE',
        })
        .promise();
    } catch (e) {
      log.error(e);
    }
  }

  try {
    await db.transaction(trx =>
      trx(PHOTOS)
        .update({
          ...body,
        })
        .where({ id: req.params.id })
        .returning('*')
        .then(async ([photo]) => {
          photoResponse = photo;
          await trx(PHOTOS_TAGS)
            .del()
            .where({
              photoId: photo.id,
            });

          if (req.body.tags && req.body.tags.length) {
            const tagsInsert = req.body.tags.map(tag => ({
              photoId: photo.id,
              tagId: tag,
            }));
            await trx(PHOTOS_TAGS).insert(tagsInsert);
          }

          tags = await trx(PHOTOS_TAGS)
            .select(`${TAGS}.${NAME} as tagName`, `${TAGS}.${ID} as tagId`)
            .where({
              photoId: req.params.id,
            })
            .leftJoin(TAGS, `${TAGS}.${ID}`, `${PHOTOS_TAGS}.${TAG_ID}`);
          return Promise.resolve();
        })
        .catch(err => {
          trx.rollback(err);
        }),
    );

    res.status(200).json({
      ...photoResponse,
      tags: tags.map(({ tagName, tagId }) => ({ id: tagId, name: tagName })),
    });
  } catch (e) {
    res.status(500);
    log.error(e);
  }
});

posts.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const [response] = await db(PHOTOS)
      .select()
      .where({ id: req.params.id, status: 'active' });
    if (!response) return res.status(404).send();
    return res.status(200).json(response);
  } catch (e) {
    log.error(e);
    return res.status(500).json(e);
  }
});

posts.post('', isAdmin, async (req, res) => {
  let pgResponse;
  const description = req.body[DESCRIPTION];
  const { name } = req.body;
  const tags = req.body[TAGS] ? req.body[TAGS] : false;
  try {
    await db.transaction(trx =>
      trx(PHOTOS)
        .insert({
          [KEY]: `original/${name}`,
          [DESCRIPTION]: description,
          [STATUS]: DELETED,
          [IS_PENDING]: true,
        })
        .returning('*')
        .then(photo => {
          pgResponse = photo;

          if (tags.length) {
            const tagsInsert = tags.map(tag => ({
              photoId: photo[0].id,
              tagId: tag,
            }));

            return trx(PHOTOS_TAGS).insert(tagsInsert);
          }
          return Promise.resolve();
        })
        .catch(trx.rollback),
    );
  } catch (e) {
    log.error('PG', e);
    return res.status(500).json({
      type: 'PG Error',
      error: e,
    });
  }

  return res.json(pgResponse[0]);
});

// Get all
posts.get('', isLoggedIn, async (req, res) => {
  // Create sub-select statement
  const as = 'photoz';
  const order = req.query.order || 'desc';

  const tagName = 'tagName';
  const tagId = 'tagId';
  const page = req.query.page || 1;
  const limit = DEFAULT_POSTS_PER_PAGE;
  const offset = (page - 1) * limit;

  let selectStatement;
  if (req.query.isPending) {
    selectStatement = db(PHOTOS)
      .select()
      .orderBy(TIMESTAMP)
      .where({ [IS_PENDING]: true })
      .as(as);
  } else {
    selectStatement = db(PHOTOS)
      .select()
      .orderBy(TIMESTAMP, order)
      .limit(limit)
      .offset(offset)
      .where({ [STATUS]: ACTIVE })
      .andWhere({ [IS_PENDING]: false })
      .as(as);
  }

  // Join with many-to-many tables
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

  const { count } = await db(PHOTOS)
    .where({ [STATUS]: ACTIVE })
    .count()
    .first();

  res.json({
    data: dedupped,
    meta: {
      page,
      count: Number(count),
      pages: Math.floor(Number(count) / limit),
    },
  });
});

export default posts;
