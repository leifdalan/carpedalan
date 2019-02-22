import db from '../../../server/db';
import { PGError } from '../../../server/errors';
import {
  ACTIVE,
  DEFAULT_POSTS_PER_PAGE,
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
} from '../../../shared/constants';

// Get all
const getAll = async ({ order = 'desc', page = 1, isPending }) => {
  // Create sub-select statement
  try {
    const as = 'photoz';

    const tagName = 'tagName';
    const tagId = 'tagId';
    const limit = DEFAULT_POSTS_PER_PAGE;
    const offset = (page - 1) * limit;

    let selectStatement;
    if (isPending) {
      selectStatement = db(PHOTOS)
        .select()
        .orderBy(TIMESTAMP)
        .where({ [IS_PENDING]: true })
        .as(as);
    } else {
      selectStatement = db(PHOTOS)
        .select()
        .orderBy(TIMESTAMP, order)
        .limit(limit)
        .offset(offset)
        .where({ [STATUS]: ACTIVE })
        .andWhere({ [IS_PENDING]: false })
        .as(as);
    }

    // Join with many-to-many tables
    const photos = await db
      .select(
        `${as}.*`,
        `${TAGS}.${NAME} as ${tagName}`,
        `${TAGS}.${ID} as ${tagId}`,
      )
      .from(selectStatement)
      .leftJoin(PHOTOS_TAGS, `${PHOTOS_TAGS}.${PHOTO_ID}`, `${as}.${ID}`)
      .leftJoin(TAGS, `${TAGS}.${ID}`, `${PHOTOS_TAGS}.${TAG_ID}`)
      .orderBy(`${as}.${TIMESTAMP}`, order);

    // Combine tag entries with the same photo id
    const dedupped = photos.reduce((acc, photo) => {
      const existing = acc.find(({ id }) => id === photo[ID]);
      if (existing) {
        if (photo[tagId]) {
          existing.tags.push({
            id: photo[tagId],
            name: photo[tagName],
          });
        }
        return acc;
      }
      return [
        ...acc,
        {
          ...photo,
          tags: photo[tagId]
            ? [{ id: photo[tagId], name: photo[tagName] }]
            : [],
          [tagName]: undefined,
          [tagId]: undefined,
        },
      ];
    }, []);

    const { count } = await db(PHOTOS)
      .where({ [STATUS]: ACTIVE })
      .count()
      .first();

    return {
      data: dedupped,
      meta: {
        page,
        count: Number(count),
        pages: Math.floor(Number(count) / limit),
      },
    };
  } catch (e) {
    throw new PGError(e.detail);
  }
};

export default getAll;
