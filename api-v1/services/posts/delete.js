import db from '../../../server/db';
import { DELETED, STATUS } from '../../../shared/constants';
import log from '../../../src/utils/log';

const del = async (req, res) => {
  try {
    const response = await db('photos')
      .update({ [STATUS]: DELETED })
      .where({ id: req.params.id });
    res.status(204).json(response);
  } catch (e) {
    res.status(404).send();
    log.error(e);
  }
};

export default del;
