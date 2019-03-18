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
  tags: ['_user'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            requests: {
              type: 'integer',
              minimum: 1,
              example: 1,
              description: 'How many times the user has requested a login',
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
  security: [{ sessionAuthentication: ['write', 'read'] }],
};

export default { post };
