import db from '../../../server/db';
import { BadRequestError } from '../../../server/errors';
import { DELETED, PHOTOS, STATUS } from '../../../shared/constants';

const bulkDelete = async ids => {
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
  } catch (e) {
    throw new BadRequestError('PG error');
  }
};

export default bulkDelete;
