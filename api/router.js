import express from 'express';

import config from '../server/config';
import { READ_USER, WRITE_USER } from '../server/constants';

const apiRouter = express.Router();

apiRouter.post('/login', (req, res) => {
  if (req.body.password === config.publicPassword) {
    req.session.user = READ_USER;
  } else if (req.body.password === config.adminPassword) {
    req.session.user = WRITE_USER;
  } else {
    res.status(401).send();
  }
  res.status(200).send({ user: req.session.user });
});

export default apiRouter;
