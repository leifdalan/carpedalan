import webpack from 'webpack';

export const applyWebpackMiddleware = app => {
  /* eslint-disable import/no-extraneous-dependencies,global-require */
  const webpackConfig = require('../webpack.config');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const devMiddlewareConfig = require('./devMiddleware.config');
  /* eslint-enable import/no-extraneous-dependencies,global-require */
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
