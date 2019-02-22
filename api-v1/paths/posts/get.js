// Showing that you don't need to have apiDoc defined on methodHandlers.
import { commonErrors } from '../../refs/error';

export default function(posts) {
  async function get(req, res) {
    const { order, page, isPending } = req.query;
    const response = await posts.getAll({
      order,
      page,
      isPending,
    });
    res.status(200).json(response);
  }

  get.apiDoc = {
    description: 'Get Posts',
    operationId: 'getPosts',
    tags: ['posts'],
    parameters: [
      {
        in: 'query',
        name: 'order',
        schema: {
          type: 'string',
          enum: ['asc', 'desc'],
        },
      },
      {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          minimum: 1,
        },
        required: true,
      },
      {
        in: 'query',
        name: 'isPending',
        schema: {
          type: 'boolean',
        },
      },
    ],
    responses: {
      ...commonErrors,
      200: {
        description: 'Users were successfully deleted.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/PostWithTags',
                  },
                },
                meta: {
                  type: 'object',
                  properties: {
                    count: {
                      type: 'integer',
                    },
                    page: {
                      type: 'integer',
                    },
                    pages: {
                      type: 'integer',
                    },
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
