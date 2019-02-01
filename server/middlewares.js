import webpack from 'webpack';
import cf from 'aws-cloudfront-sign';

import { CF_TIMEOUT } from '../shared/constants';

import { assets, isProd, cdnDomain, domain, cfKey } from './config';

let clientAssets = false;
if (isProd) {
  const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => manifest[asset]);
}

export function setSignedCloudfrontCookie(res) {
  const options = {
    keypairId: cfKey,
    privateKeyPath: `/app/pk-${cfKey}.pem`,
    expireTime: new Date().getTime() + CF_TIMEOUT,
  };
  const signedCookies = cf.getSignedCookies(`https://${cdnDomain}/*`, options);

  if (Object.keys(signedCookies).length) {
    Object.keys(signedCookies).forEach(key => {
      res.cookie(key, signedCookies[key], {
        domain: `.${domain}`,
        path: '/',
        // secure: true,
        http: true,
        // maxAge: 1000 * 5,
      });
    });
  }
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
    req.session.requests = req.session.requests + 1; // eslint-disable-line operator-assignment
    setSignedCloudfrontCookie(res);
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
      isProd,
    });
  } else {
    req.session.requests = req.session.requests + 1; // eslint-disable-line operator-assignment
    setSignedCloudfrontCookie(res);
    next();
  }
};
