import { commonErrors } from '../../refs/error';

const status = 200;

export async function getTags(tags, redis) {
  /**
   * "Stale until revalidate" cache method
   */
  try {
    const stringTags = await redis.get('tags');
    if (stringTags) {
      const tagsFromCache = JSON.parse(stringTags);
      return tagsFromCache;
    }
  } catch (e) {
      console.error('Caught Redis Error', e); // eslint-disable-line
  }

  const tagsWithCount = await tags.getTags();
  await redis.set('tags', JSON.stringify(tagsWithCount));
  return tagsWithCount;
}

export default function(tags, redis) {
  const get = async (req, res) => {
    const tagsWithCount = await getTags(tags, redis);
    res.status(status).json(tagsWithCount);
    return null;
  };

  get.apiDoc = {
    description: 'Get Tags',
    operationId: 'getTags',
    tags: ['tags', 'read'],
    parameters: [],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Tags were successfully fetched.',
        content: {
          'application/json': {
            schema: {
              description: 'An array of tag objects',
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of tag',
                  },
                  id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'uuid of tag',
                  },
                  count: {
                    type: 'integer',
                    description: 'Number of associations currently with tag',
                  },
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
