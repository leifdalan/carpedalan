import { assets, cdnDomain, isProd, ci, nodeEnv, assetDomain } from './config';
import db from './db';

let clientAssets = false;
if (isProd) {
  const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => manifest[asset]);
}

export default (app, openApiDoc) => {
  // app.use('/api', api);

  app.get('/login', (req, res) => {
    res.render('index', {
      openApiDoc: JSON.stringify(openApiDoc),
      layout: false,
      session: JSON.stringify(req.session),
      clientAssets,
      isProd,
      assetDomain,
      meta: JSON.stringify({
        cdn: cdnDomain,
        ci,
        nodeEnv,
      }),
    });
  });

  app.get('/', (req, res) => {
    res.render('index', {
      layout: false,
      openApiDoc: JSON.stringify(openApiDoc),
      session: JSON.stringify(req.session),
      isProd,
      clientAssets,
      assetDomain,
      meta: JSON.stringify({
        cdn: cdnDomain,
        ci,
        nodeEnv,
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
        session: JSON.stringify(req.session),
        clientAssets,
        assetDomain,
        meta: JSON.stringify({ cdn: cdnDomain, ci, nodeEnv }),
      });
    }
  });

  app.get('/healthcheck', async (req, res) => {
    await db.raw('select 1+1 as result');
    res.status(200).json({
      farts: 'for your health',
      clownpenis: 'dot fartzz',
    });
  });

  app.use('*', (req, res) => {
    res.status(404).render('index', {
      layout: false,
      isProd,
      openApiDoc: JSON.stringify(openApiDoc),
      assetDomain,
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
