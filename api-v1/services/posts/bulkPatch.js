import db from '../../../server/db';
import { BadRequestError } from '../../../server/errors';
import { DESCRIPTION, PHOTOS, PHOTOS_TAGS } from '../../../shared/constants';

const bulkPatch = async ({ ids, tags, description }) => {
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
        throw new BadRequestError(e.detail);
      }
    });
  } catch (e) {
    throw new BadRequestError(e.detail);
  }
};

export default bulkPatch;
