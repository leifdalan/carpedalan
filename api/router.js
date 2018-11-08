import express from 'express';

const apiRouter = express.Router();

apiRouter.post('/login', (req, res) => {
  res.cookie('test', 'cookie');
  req.session.user = { some: 'object' };
  res.status(200).send(200);
});

export default apiRouter;
