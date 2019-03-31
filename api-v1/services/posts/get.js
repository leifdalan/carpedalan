import db from '../../../server/db';
import { NotFoundError } from '../../../server/errors';
import { PHOTOS } from '../../../shared/constants';

const get = async id => {
  const [response] = await db(PHOTOS)
    .select()
    .where({ id, status: 'active' });

  if (!response) throw new NotFoundError(id);
  return response;
};
export default get;
