const responseCode = 204;

export default function(posts) {
  const bulkDelete = async function(req, res, next) {
    const { ids } = req.body;
    try {
      const response = await posts.bulkDelete(ids);
      res.status(responseCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  bulkDelete.apiDoc = {
    description: 'Delete bulk posts',
    operationId: 'deleteBulkPosts',
    tags: ['posts', 'bulk', 'write'],
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

  return bulkDelete;
}
