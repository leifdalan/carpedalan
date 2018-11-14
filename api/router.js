import express from 'express';
import { S3 } from 'aws-sdk';
import multer from 'multer';
import exif from 'exif-parser';

import { publicPassword, adminPassword, bucket } from '../server/config';
import { READ_USER, WRITE_USER } from '../server/constants';
import db from '../server/db';
import { isLoggedIn, isAdmin } from '../server/middlewares';
import {
  ACTIVE,
  DELETED,
  DESCRIPTION,
  ETAG,
  IMAGES_PATH,
  KEY,
  STATUS,
  TAGS,
  TIMESTAMP,
} from '../shared/constants';
import log from '../src/utils/log';

// Create S3 interface object
const s3 = new S3();
// Use memory storage for multer "store" - note: will hold file buffers
// in-memory! Considering writing custom store that streams to S3 if this
// becomes a problem
const storage = multer.memoryStorage();
// Create middleware object
const uploadMiddleware = multer({ storage });

const api = express.Router();

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

api.delete('/posts/:id', isAdmin, async (req, res) => {
  try {
    const response = await db('photos')
      .update({ [STATUS]: DELETED })
      .where({ id: req.params.id });
    res.status(204).json(response);
  } catch (e) {
    log.error(e);
  }
});

api.patch('/posts/:id', isAdmin, async (req, res) => {
  try {
    const [response] = await db('photos')
      .update(req.body)
      .where({ id: req.params.id })
      .returning('*');
    res.status(200).json(response);
  } catch (e) {
    log.error(e);
  }
});

api.post(
  '/posts',
  isAdmin,
  // use multer middleware for multipart upload data parsing
  uploadMiddleware.single('photo'),
  async (req, res) => {
    let s3Response;
    let result;
    let pgResponse;
    const description = req.body[DESCRIPTION];
    const tags = req.body[TAGS] ? req.body[TAGS].split(',') : false;

    // Parse exif data for original timestamp and other
    // metadata
    try {
      const parser = exif.create(req.file.buffer);
      result = parser.parse();
      log.info(result);
    } catch (e) {
      return res.status(500).json({
        type: 'EXIF parsing error',
        error: e,
      });
    }

    // Upload to s3
    try {
      s3Response = await s3
        .upload({
          Key: `original/${req.file.originalname}`,
          Bucket: bucket,
          Body: req.file.buffer,
          ContentType: 'image/jpeg',
        })
        .on('httpUploadProgress', progress => {
          log.info('progress', progress);
        })
        .on('httpDownloadProgress', progress => {
          log.info('down progress', progress);
        })
        .promise();
    } catch (e) {
      log.error(e);
      return res.status(500).json({
        type: 'AWS error',
        error: e,
      });
    }

    // Transact photos and tags, depending
    try {
      await db.transaction(trx =>
        trx('photos')
          .insert({
            [TIMESTAMP]: result.tags.DateTimeOriginal,
            [ETAG]: s3Response.ETag,
            [KEY]: s3Response.key,
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

              return trx('photos_tags').insert(tagsInsert);
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

// Get all posts
api.get('/posts', isLoggedIn, async (req, res) => {
  // Create sub-select statement
  const order = req.query.order || 'desc';
  const selectStatement = db('photos')
    .select()
    .orderBy(TIMESTAMP, order)
    .limit(20)
    .where({ [STATUS]: ACTIVE })
    .as('photoz');

  // Join with many-to-many tables
  const photos = await db
    .select('photoz.*', 'tags.name as tagName', 'tags.id as tagId')
    .from(selectStatement)
    .leftJoin('photos_tags', 'photos_tags.photoId', 'photoz.id')
    .leftJoin('tags', 'tags.id', 'photos_tags.tagId')
    .orderBy('photoz.timestamp', order);

  // Combine tag entries with the same photo id
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

api.get('/tags/:tag', isLoggedIn, async (req, res) => {
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

  res.status(200).send(photos);
});

api.get('/tags', isLoggedIn, async (req, res) => {
  const tags = await db('tags').select();
  res.status(200).send(tags);
});

export default api;
