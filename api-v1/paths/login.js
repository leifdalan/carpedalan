import { adminPassword, publicPassword } from '../../server/config';
import { READ_USER, WRITE_USER } from '../../server/constants';
import { setSignedCloudfrontCookie } from '../../server/middlewares';

const status = 200;

const login = posts => {
  const post = (req, res) => {
    if (req.body.password === publicPassword) {
      req.session.user = READ_USER;
      req.session.requests = 1;
      setSignedCloudfrontCookie(res);
      res.status(status).send({ user: req.session.user });
    } else if (req.body.password === adminPassword) {
      req.session.user = WRITE_USER;
      req.session.requests = 1;
      setSignedCloudfrontCookie(res);
      res.status(status).send({ user: req.session.user });
    } else {
      res.status(401).send();
    }
  };
  post.apiDoc = {
    description: 'Log user in',
    operationId: 'login',
    tags: ['user', 'login'],
    requestBody: {
      description: 'Request body for login',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              password: {
                type: 'string',
                format: 'password',
              },
            },
            required: ['password'],
          },
        },
      },
    },
    responses: {
      [status]: {
        description: 'User successfully logged in',
      },
      401: {
        description: 'User sent a bad password',
        content: {
          'application/json': {
            schema: {
              $ref: '#components/schemas/Error',
            },
          },
        },
      },
    },
  };
  return post;
};

export default login;
