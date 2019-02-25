export default function(posts) {
  const patch = async function(req, res, next) {
    try {
      const response = await posts.get(req.params.id);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  patch.apiDoc = {
    description: 'Get Posts',
    operationId: 'postPosts',
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
      200: {
        description: 'Users were successfully deleted.',
      },
    },
    security: [{ sessionAuthentication: ['read'] }],
  };

  return patch;
}
