import webpack from 'webpack';

import { assets, isProd } from './config';

let clientAssets = false;
if (isProd) {
  const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => manifest[asset]);
}

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
    res.status(401).render('index', {
      layout: false,
      session: JSON.stringify(req.session),
      clientAssets,
      meta: {},
    });
  } else {
    next();
  }
};
