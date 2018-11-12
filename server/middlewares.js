import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../webpack.config';

import devMiddlewareConfig from './devMiddleware.config';

// eslint-disable-next-line
export const applyWebpackMiddleware = app => {
  const compiler = webpack(webpackConfig);
  app.use(devMiddleware(compiler, devMiddlewareConfig));
  app.use(hotMiddleware(compiler));
};

export const isAdmin = (req, res, next) => {
  if (req.session.user !== 'write') {
    res.status(401).send();
  } else {
    next();
  }
};

export const isLoggedIn = (req, res, next) => {
  if (!['read', 'write'].includes(req.session.user)) {
    res.status(401).send();
  } else {
    next();
  }
};
