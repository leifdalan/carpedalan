import db from '../../../server/db';
import { NotFoundError } from '../../../server/errors';
import { DELETED, STATUS } from '../../../shared/constants';

const del = async id => {
  const response = await db('photos')
    .update({ [STATUS]: DELETED })
    .where({ id });
  console.error('response', response);

  if (!response) throw new NotFoundError();
  return response;
};

export default del;
