const status = 200;

export default function(posts) {
  const get = async function(req, res, next) {
    try {
      const response = await posts.get(req.params.id);
      res.status(status).json(response);
    } catch (e) {
      next(e);
    }
  };

  get.apiDoc = {
    description: 'Get Post',
    operationId: 'getPost',
    tags: ['posts', 'read'],
    parameters: [
      {
        in: 'path',
        name: 'id',
        schema: {
          type: 'string',
          format: 'uuid',
          description: 'uuid of post record to retrieve',
        },
      },
    ],
    responses: {
      [status]: {
        description: 'Users were successfully deleted.',
      },
    },
    security: [{ sessionAuthentication: ['read', 'write'] }],
  };

  return get;
}
