import { adminPassword, publicPassword } from '../../server/config';
import { READ_USER, WRITE_USER } from '../../server/constants';
import { setSignedCloudfrontCookie } from '../../server/middlewares';

const status = 200;

const logout = () => {
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
    description: 'Log user logout',
    operationId: 'login',
    tags: ['user'],
    responses: {
      [status]: {
        description: 'User successfully logged in',
      },
    },
    security: [],
  };
  return { post };
};

export default logout;
