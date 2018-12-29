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
} from '../../shared/constants';
import log from '../../src/utils/log';

// Create S3 interface object
const s3 = new S3({ region: 'us-west-2' });
// Use memory storage for multer "store" - note: will hold file buffers
// in-memory! Considering writing custom store that streams to S3 if this
// becomes a problem
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
  try {
    const [response] = await db(PHOTOS)
      .update(req.body)
      .where({ id: req.params.id })
      .returning('*');
    res.status(200).json(response);
  } catch (e) {
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
    console.time('middleWare');
    next();
  },
  uploadMiddleware.single('photo'),
  (req, res, next) => {
    console.timeEnd('middleWare');
    next();
  },

  async (req, res) => {
    let s3Response;
    let result;
    let pgResponse;
    const description = req.body[DESCRIPTION];
    const tags = req.body[TAGS] ? req.body[TAGS].split(',') : false;
    // Parse exif data for original timestamp and other
    // metadata
    console.time('exif');
    try {
      const parser = exif.create(req.file.buffer);
      result = parser.parse();
    } catch (e) {
      return res.status(500).json({
        type: 'EXIF parsing error',
        error: e,
      });
    }
    console.timeEnd('exif');

    console.time('sharp');
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
    console.timeEnd('sharp');
    // Upload to s3
    console.time('s3');
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
    console.timeEnd('s3');

    // Transact photos and tags, depending
    try {
      await db.transaction(trx =>
        trx(PHOTOS)
          .insert({
            [TIMESTAMP]: result.tags.DateTimeOriginal,
            [ETAG]: s3Response.ETag,
            [KEY]: s3Response.Key,
            [DESCRIPTION]: description,
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
  const selectStatement = db(PHOTOS)
    .select()
    .orderBy(TIMESTAMP, order)
    .limit(20)
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

  res.json(dedupped);
});

export default posts;
