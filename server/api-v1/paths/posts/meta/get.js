// Showing that you don't need to have apiDoc defined on methodHandlers.

import startOfMonth from 'date-fns/fp/startOfMonth';
import fromUnixTime from 'date-fns/fp/fromUnixTime';
import getUnixTime from 'date-fns/fp/getUnixTime';
import addMonths from 'date-fns/fp/addMonths';
import flow from 'lodash/fp/flow';

import { commonErrors } from '../../../refs/error';
import {
  EXIFPROPS,
  STATUS,
  PHOTOS,
  ACTIVE,
  TIMESTAMP,
} from '../../../../../shared/constants';

const status = 200;

export async function getMeta(db, redis) {
  /**
   * "Stale until revalidate" cache method
   */
  try {
    const stringMeta = await redis.get('meta');
    if (stringMeta) {
      const meta = JSON.parse(stringMeta);
      if (meta) return meta;
    }
  } catch (e) {
    console.error('Caught Redis Error', e); // eslint-disable-line
  }

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

  const { timestamp: firstTimestamp } = await db(PHOTOS)
    .select(TIMESTAMP)
    .where({ [STATUS]: ACTIVE })
    .whereNot({ [TIMESTAMP]: null })
    .limit(1)
    .orderBy(TIMESTAMP, 'asc')
    .first();
  const { timestamp: secondTimestamp } = await db(PHOTOS)
    .select(TIMESTAMP)
    .where({ [STATUS]: ACTIVE })
    .whereNot({ [TIMESTAMP]: null })
    .limit(1)
    .orderBy(TIMESTAMP, 'desc')
    .first();
  const getStartOfMonthInUnix = flow(fromUnixTime, startOfMonth, getUnixTime);
  const firstMonth = getStartOfMonthInUnix(firstTimestamp);
  const lastMonth = getStartOfMonthInUnix(secondTimestamp);
  let mutableTimeStamp = firstMonth;
  const months = {};
  while (mutableTimeStamp <= lastMonth) {
    const lastTimestamp = mutableTimeStamp;
    mutableTimeStamp = flow(
      fromUnixTime,
      startOfMonth,
      addMonths(1),
      getUnixTime,
    )(mutableTimeStamp);

    const query = db(PHOTOS)
      .where({ [STATUS]: ACTIVE })
      .andWhere(TIMESTAMP, '<', mutableTimeStamp)
      .andWhere(TIMESTAMP, '>', lastTimestamp)
      .count()
      .first();
    months[lastTimestamp] = query;
  }
  console.time('All the meta requests'); // eslint-disable-line no-console
  const mappedPromises = await Promise.all(
    Object.keys(months).map(async month => {
      const { count: monthCount } = await months[month];
      return {
        [month]: Number(monthCount),
      };
    }),
  );
  console.timeEnd('All the meta requests'); // eslint-disable-line no-console
  const frequencyByMonth = mappedPromises.reduce(
    (acc, obj) => ({
      ...acc,
      ...obj,
    }),
    {},
  );
  const response = {
    count: Number(count),
    averageRatio,
    frequencyByMonth,
    firstTimestamp,
    lastTimestamp: secondTimestamp,
  };
  await redis.set('meta', JSON.stringify(response));
  return response;
}

export default function(db, redis) {
  async function get(req, res) {
    const response = getMeta(db, redis);
    res.status(status).json(response);
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
              required: [
                'count',
                'averageRatio',
                'frequencyByMonth',
                'fistTimestamp',
                'lastTimestamp',
              ],
              properties: {
                count: {
                  description: 'Number of posts',
                  type: 'integer',
                },
                firstTimestamp: {
                  description: 'timestamp of first post',
                  type: 'integer',
                },
                lastTimestamp: {
                  description: 'timestamp of last post',
                  type: 'integer',
                },
                averageRatio: {
                  description: 'Average aspect ratio of all posts',
                  type: 'number',
                },
                frequencyByMonth: {
                  description:
                    'Object with keys as timestamps, which are the beginning of the month and values as number of active posts in that month',
                  type: 'object',
                  additionalProperties: true,
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
