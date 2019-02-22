import db from '../../../server/db';
import { BadRequestError, NotFoundError } from '../../../server/errors';
import { PHOTOS } from '../../../shared/constants';
import log from '../../../src/utils/log';

const get = async id => {
  let response;
  try {
    const post = await db(PHOTOS)
      .select()
      .where({ id, status: 'active' });

    [response] = post;
  } catch (e) {
    log.error(e);
    throw new BadRequestError();
  }

  if (!response) throw new NotFoundError(id);
  return response;
};
export default get;
