export default function(posts) {
  const patch = async function(req, res, next) {
    const { body } = req;
    try {
      const response = await posts.update(body, req.params.id);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  patch.apiDoc = {
    description: 'Patch Posts',
    operationId: 'postPosts',
    tags: ['posts', 'write'],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Post',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Users were successfully deleted.',
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return patch;
}
