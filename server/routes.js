import {
  assetDomain,
  assets,
  branch,
  buildNum,
  cdnDomain,
  ci,
  isProd,
  nodeEnv,
  sha1,
  useProdAssets,
} from './config';
import setSignedCloudfrontCookie from './api-v1/middlewares/setCloudfrontCookie';
import db from './db';

let clientAssets = false;

/* istanbul ignore next */
if (useProdAssets) {
  const manifest = require('./dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => `${manifest[asset]}`);
}

const buildInfo = {
  branch,
  buildNum,
  sha1,
};

export default (app, openApiDoc) => {
  app.get('/login', (req, res) => {
    res.render('index', {
      openApiDoc: JSON.stringify(openApiDoc),
      layout: false,
      session: JSON.stringify(req.session),
      clientAssets,
      isProd,
      useProdAssets,

      assetDomain,
      ...buildInfo,
      meta: JSON.stringify({
        cdn: cdnDomain,
        ci,
        nodeEnv,
      }),
    });
  });

  const regularAppHandler = (req, res) => {
    res.render('index', {
      layout: false,
      openApiDoc: JSON.stringify(openApiDoc),
      session: JSON.stringify(req.session),
      isProd,
      useProdAssets,
      clientAssets,
      assetDomain,
      ...buildInfo,
      meta: JSON.stringify({
        cdn: cdnDomain,
        ci,
        nodeEnv,
      }),
    });
  };

  app.get('/', regularAppHandler);
  app.get('/gallery/*', regularAppHandler);
  app.get('/tag/**/', regularAppHandler);

  app.get('/baby', (req, res) => {
    setSignedCloudfrontCookie(res);
    res.render('index', {
      layout: false,
      openApiDoc: JSON.stringify(openApiDoc),
      session: JSON.stringify(req.session),
      isProd,
      useProdAssets,
      clientAssets,
      assetDomain,
      meta: JSON.stringify({
        cdn: cdnDomain,
        ci,
        nodeEnv,
        assetDomain,
      }),
    });
  });

  app.get('/admin/*', (req, res) => {
    if (req.session.user !== 'write') {
      res.redirect(301, '/');
    } else {
      res.render('index', {
        layout: false,
        openApiDoc: JSON.stringify(openApiDoc),
        isProd,
        useProdAssets,
        session: JSON.stringify(req.session),
        clientAssets,
        assetDomain,
        ...buildInfo,
        meta: JSON.stringify({ cdn: cdnDomain, ci, nodeEnv }),
      });
    }
  });

  app.get('/healthcheck', async (req, res) => {
    if (isProd) await db.raw('select 1+1 as result');
    res.status(200).json({
      farts: 'for your health',
      clownpenis: 'dot fartzz',
    });
  });

  app.use('*', (req, res) => {
    res.status(404).render('index', {
      layout: false,
      isProd,
      useProdAssets,
      openApiDoc: JSON.stringify(openApiDoc),
      assetDomain,
      ...buildInfo,
      session: JSON.stringify(req.session),
      meta: JSON.stringify({
        status: 404,
        cdn: cdnDomain,
        ci,
        nodeEnv,
      }),
      clientAssets,
    });
  });
};
