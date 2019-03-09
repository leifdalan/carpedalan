const status = 200;

const login = () => {
  const post = (req, res) => {
    res.status(200).send({ refreshed: true });
  };
  post.apiDoc = {
    description: 'User refreshed cookie',
    operationId: 'refresh',
    tags: ['_user'],
    responses: {
      [status]: {
        description: 'User successfully refreshed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                refreshed: {
                  description:
                    'Acknoweldgement that the user has been refreshed',
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
        },
      },
      401: {
        description: "User wasn't logged in",
        content: {
          'application/json': {
            schema: {
              $ref: '#components/schemas/Error',
            },
          },
        },
      },
    },
    security: [],
  };
  return { post };
};

export default login;
