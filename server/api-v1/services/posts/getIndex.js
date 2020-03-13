import db from '../../../db';
import { PGError } from '../../../errors';
import {
  ACTIVE,
  ID,
  IS_PENDING,
  NAME,
  PHOTO_ID,
  PHOTOS,
  PHOTOS_TAGS,
  STATUS,
  TAG_ID,
  TAGS,
  TIMESTAMP,
} from '../../../../shared/constants';
import { defaultPostsPerPage } from '../../../config';

// Get all
const getIndex = async timestamp => {
  // Create sub-select statement
  try {
    const results = await db.raw(`SELECT
    timestamp,
    ROW_NUMBER () OVER (ORDER BY timestamp ASC)
 FROM photos
 `);

    return {
      index: 5,
    };
  } catch (e) {
    throw new PGError(e.detail);
  }
};

export default getIndex;
