// Showing that you don't need to have apiDoc defined on methodHandlers.

import { commonErrors } from '../../../refs/error';
import { BadRequestError } from '../../../../errors';
import {
  CREATEDAT,
  DATE,
  DESCRIPTION,
  ETAG,
  EXIFPROPS,
  ID,
  KEY,
  ORIGINALURL,
  STATUS,
  TIMESTAMP,
  UPDATEDAT,
  PHOTOS,
  ACTIVE,
} from '../../../../../shared/constants';

const status = 200;

export default function(db) {
  async function get(req, res) {
    const { count } = await db(PHOTOS)
      .where({ [STATUS]: ACTIVE })
      .count()
      .first();

    const { count: portraitOrientationCount } = await db(PHOTOS)
      // Orientation === 1 is portrait
      .where({ [STATUS]: ACTIVE, [EXIFPROPS.Orientation]: 1 })
      .count()
      .first();

    const portraitRatio = 0.75;
    const landscapeRatio = 4 / 3;
    const averageRatio =
      (portraitRatio * portraitOrientationCount +
        (count - portraitOrientationCount) * landscapeRatio) /
      count;

    return res.status(status).json({ count: Number(count), averageRatio });
  }

  get.apiDoc = {
    description: 'Gets the index of a post by timestamp',
    operationId: 'getPostMeta',
    tags: ['posts', 'read'],
    parameters: [],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Meta information about all active posts',
        content: {
          'application/json': {
            schema: {
              description: 'Result of get meta',
              type: 'object',
              required: ['count', 'averageRatio'],
              properties: {
                count: {
                  description: 'Number of posts',
                  type: 'integer',
                },
                averageRatio: {
                  description: 'Average aspect ratio of all posts',
                  type: 'number',
                },
              },
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write', 'read'] }],
  };

  return get;
}
