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
      });
    }
  });

  app.use('*', (req, res) => {
    if (!['read', 'write'].includes(req.session.user) || !req.session.user) {
      res.redirect(301, '/login');
    } else if (['read', 'write'].includes(req.session.user)) {
      res.render('index', {
        layout: false,
        session: JSON.stringify(req.session),
        clientAssets,
      });
    }
  });
};
