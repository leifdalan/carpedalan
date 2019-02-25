// Showing that you don't need to have apiDoc defined on methodHandlers.

import { commonErrors } from '../../refs/error';

const status = 200;

export default function(posts) {
  async function get(req, res, next) {
    const { order, page, isPending } = req.query;
    try {
      const response = await posts.getAll({
        order,
        page,
        isPending,
      });
      res.status(status).json(response);
    } catch (e) {
      next(e);
    }
  }

  get.apiDoc = {
    description: 'Get Posts',
    operationId: 'getPosts',
    tags: ['posts', 'read'],
    parameters: [
      {
        in: 'query',
        name: 'order',
        schema: {
          type: 'string',
          enum: ['asc', 'desc'],
          default: 'desc',
        },
      },
      {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1,
        },
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
      [status]: {
        description: 'Users were successfully deleted.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PostList',
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write', 'read'] }],
  };

  return get;
}
