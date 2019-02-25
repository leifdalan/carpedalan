import { commonErrors } from '../refs/error';

const status = 200;

const post = (req, res, next) => {
  try {
    Object.keys(req.body || {}).forEach(key => {
      req.session[key] = req.body[key];
    });
    res.status(status).json(req.session);
  } catch (e) {
    next(e);
  }
};
post.apiDoc = {
  description: 'Setting a property on the user session cookie token',
  operationId: 'setUser',
  tags: ['user'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            requests: {
              type: 'integer',
              minimum: 1,
              example: 1,
            },
          },
        },
      },
    },
  },
  responses: {
    ...commonErrors,
    [status]: {
      description: 'User successfully logged in',
    },
  },
  security: [],
};

export default { post };
