import AWS from 'aws-sdk';
import omit from 'lodash/omit';

import { bucket } from '../../../server/config';
import db from '../../../server/db';
import { PGError } from '../../../server/errors';
import {
  ID,
  NAME,
  PHOTOS,
  PHOTOS_TAGS,
  TAG_ID,
  TAGS,
} from '../../../shared/constants';
import log from '../../../src/utils/log';

const s3 = new AWS.S3();

const update = async (body, id) => {
  let photoResponse;
  let tags = [];
  const filteredBody = omit(body, ['tags', 'rotate', 'key']);

  if (body.rotate) {
    try {
      await s3
        .copyObject({
          Bucket: bucket,
          Key: `raw/${body.key.split('/')[1]}`,
          CopySource: `${bucket}/raw/${body.key.split('/')[1]}`,
          Metadata: {
            rotate: `${body.rotate}`,
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
          ...filteredBody,
        })
        .where({ id })
        .returning('*')
        .then(async ([photo]) => {
          photoResponse = photo;
          await trx(PHOTOS_TAGS)
            .del()
            .where({
              photoId: photo.id,
            });

          if (body.tags && body.tags.length) {
            log.info('doing it');
            const tagsInsert = body.tags.map(tag => ({
              photoId: photo.id,
              tagId: tag,
            }));
            await trx(PHOTOS_TAGS).insert(tagsInsert);
          }

          tags = await trx(PHOTOS_TAGS)
            .select(`${TAGS}.${NAME} as tagName`, `${TAGS}.${ID} as tagId`)
            .where({
              photoId: id,
            })
            .leftJoin(TAGS, `${TAGS}.${ID}`, `${PHOTOS_TAGS}.${TAG_ID}`);
          return Promise.resolve();
        })
        .catch(err => {
          trx.rollback(err);
          throw new PGError(err.detail);
        }),
    );

    return {
      ...photoResponse,
      tags: tags.map(({ tagName, tagId }) => ({ id: tagId, name: tagName })),
    };
  } catch (e) {
    log.error(e);
    throw new PGError(e.detail);
  }
};

export default update;
