import db from '../../../server/db';
import { PGError } from '../../../server/errors';
import {
  DELETED,
  DESCRIPTION,
  IS_PENDING,
  KEY,
  PHOTOS,
  PHOTOS_TAGS,
  STATUS,
  TAGS,
} from '../../../shared/constants';
import log from '../../../src/utils/log';

const create = async body => {
  let pgResponse;
  const description = body[DESCRIPTION];
  const { name } = body;
  const tags = body[TAGS] ? body[TAGS] : false;
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
    throw new PGError(e.detail);
  }

  return pgResponse[0];
};

export default create;
