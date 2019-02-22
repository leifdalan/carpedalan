const responseCode = 201;

export default function(posts) {
  const bulkPatch = async function(req, res, next) {
    const { ids, tags, description } = req.body;
    try {
      const response = await posts.bulkPatch({ ids, tags, description });
      res.status(responseCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  bulkPatch.apiDoc = {
    description: 'Get Posts',
    operationId: 'postPosts',
    tags: ['posts', 'bulk'],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ids: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'uuid',
                },
              },
              tags: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'uuid',
                },
              },
              description: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    responses: {
      [responseCode]: {
        description: 'Posts were successfully updated',
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return bulkPatch;
}
