import express from 'express';
import { S3 } from 'aws-sdk';
import multer from 'multer';
import exif from 'exif-parser';
import sharp from 'sharp';

import { bucket } from '../../server/config';
import db from '../../server/db';
import { isLoggedIn, isAdmin } from '../../server/middlewares';
import {
  ACTIVE,
  DELETED,
  DESCRIPTION,
  ETAG,
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
  EXIFPROPS,
} from '../../shared/constants';
import log from '../../src/utils/log';

// Create S3 interface object
const s3 = new S3({ region: 'us-west-2' });
// Use memory storage for multer "store" - note: will hold file buffers
// in-memory! Considering writing custom store that streams to S3 if this
// becomes a problem
// -------- This is a problem ahhahaha
const storage = multer.memoryStorage();
// Create middleware object
const uploadMiddleware = multer({ storage });

const posts = express.Router();

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
  try {
    await db.transaction(trx =>
      trx(PHOTOS)
        .update({
          [DESCRIPTION]: req.body.description,
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
            log.info('doing it');
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

posts.post(
  '',
  isAdmin,
  (req, res, next) => {
    // console.time('middleWare');
    next();
  },
  uploadMiddleware.single('photo'),
  (req, res, next) => {
    // console.timeEnd('middleWare');
    next();
  },

  async (req, res) => {
    let s3Response;
    let exifData;
    let pgResponse;
    const description = req.body[DESCRIPTION];
    const tags = req.body[TAGS] ? req.body[TAGS].split(',') : false;
    // Parse exif data for original timestamp and other
    // metadata
    // console.time('exif');
    try {
      const parser = exif.create(req.file.buffer);
      exifData = parser.parse();
    } catch (e) {
      return res.status(500).json({
        type: 'EXIF parsing error',
        error: e,
      });
    }
    // console.timeEnd('exif');

    // console.time('sharp');
    let buffer;
    try {
      buffer = await sharp(req.file.buffer)
        .rotate()
        .toBuffer();
    } catch (e) {
      return res.status(500).json({
        type: 'Sharp error',
        error: e,
      });
    }
    // console.timeEnd('sharp');
    // Upload to s3
    // console.time('s3');
    try {
      s3Response = await s3
        .upload({
          Key: `original/${req.file.originalname}`,
          Bucket: bucket,
          Body: buffer,
          Region: 'us-west-2',
          ContentType: 'image/jpeg',
        })
        .promise();
    } catch (e) {
      log.error(e);
      return res.status(500).json({
        type: 'AWS Error',
        error: e,
      });
    }
    // console.timeEnd('s3');

    // Transact photos and tags, depending
    try {
      const validExifData = Object.keys(EXIFPROPS).reduce(
        (acc, key) => ({
          ...acc,
          ...(exifData.tags[key]
            ? { [EXIFPROPS[key]]: exifData.tags[key] }
            : {}),
        }),
        {},
      );
      await db.transaction(trx =>
        trx(PHOTOS)
          .insert({
            [TIMESTAMP]: exifData.tags.DateTimeOriginal,
            [ETAG]: s3Response.ETag,
            [KEY]: s3Response.Key,
            [DESCRIPTION]: description,
            ...validExifData,
          })
          .returning('*')
          .then(photo => {
            pgResponse = photo;

            if (tags.length) {
              log.info('doing it');
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
    // log.info(s3Response[0]);
    return res.json(pgResponse[0]);
  },
);

// Get all
posts.get('', isLoggedIn, async (req, res) => {
  // Create sub-select statement
  const order = req.query.order || 'desc';
  const as = 'photoz';
  const tagName = 'tagName';
  const tagId = 'tagId';
  const page = req.query.page || 1;
  const limit = 100;
  const offset = (page - 1) * limit;
  const selectStatement = db(PHOTOS)
    .select()
    .orderBy(TIMESTAMP, order)
    .limit(limit)
    .offset(offset)
    .where({ [STATUS]: ACTIVE })
    .as(as);

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
