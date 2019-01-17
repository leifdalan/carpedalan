import api from '../api/router';

import { assets, isProd } from './config';

let clientAssets = false;
if (isProd) {
  const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
  clientAssets = assets.map(asset => manifest[asset]);
}

export default app => {
  app.use('/api', api);

  app.get('/login', (req, res) => {
    res.render('index', {
      layout: false,
      session: JSON.stringify(req.session),
      clientAssets,
      meta: JSON.stringify({}),
    });
  });

  app.get('/', (req, res) => {
    res.render('index', {
      layout: false,
      session: JSON.stringify(req.session),
      clientAssets,
      meta: JSON.stringify({}),
    });
  });

  app.get('/admin/*', (req, res) => {
    if (req.session.user !== 'write') {
      res.redirect(301, '/');
    } else {
      res.render('index', {
        layout: false,
        session: JSON.stringify(req.session),
        clientAssets,
        meta: JSON.stringify({}),
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).render('index', {
      layout: false,
      session: JSON.stringify(req.session),
      meta: JSON.stringify({
        status: 404,
      }),
      clientAssets,
    });

    // if (!['read', 'write'].includes(req.session.user) || !req.session.user) {
    //   res.redirect(301, '/login');
    // } else if (['read', 'write'].includes(req.session.user)) {
    // }
  });
};
