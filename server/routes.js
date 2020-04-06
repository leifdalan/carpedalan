import db from './db';
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
import redis from './api-v1/services/redis';
import tags from './api-v1/services/tags';
import { getMeta } from './api-v1/paths/posts/meta/get';
import { getTags } from './api-v1/paths/tags/get';

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
  const regularAppHandler = async (req, res) => {
    let meta = {
      count: Number(10000),
      averageRatio: 1,
      frequencyByMonth: {},
      firstTimestamp: 14637024,
      lastTimestamp: new Date(),
    };
    try {
      meta = await getMeta(db, redis);
    } catch (e) {
      console.error('Failed to get meta!', e); // eslint-disable-line no-console
    }

    let tagResponse = [];

    try {
      tagResponse = await getTags(tags, redis);
    } catch (e) {
      console.error('Failed to get tags!', e); // eslint-disable-line no-console
    }

    res.render('index', {
      layout: false,
      openApiDoc: JSON.stringify(openApiDoc),
      session: JSON.stringify(req.session),
      isProd,
      useProdAssets,
      clientAssets,
      assetDomain,
      cdnDomain,
      ...buildInfo,
      meta: JSON.stringify({
        cdn: cdnDomain,
        ci,
        nodeEnv,
        posts: meta,
        tags: tagResponse,
      }),
    });
  };

  app.get('/login', regularAppHandler);

  app.get('/', regularAppHandler);
  app.get('/gallery/*', regularAppHandler);
  app.get('/tag/**/', regularAppHandler);

  app.get(
    '/baby',
    (req, res, next) => {
      setSignedCloudfrontCookie(res);
      next();
    },
    regularAppHandler,
  );

  app.get(
    '/admin/*',
    (req, res, next) => {
      if (req.session.user !== 'write') {
        res.redirect(301, '/');
      } else {
        next();
      }
    },
    regularAppHandler,
  );

  app.use('*', (req, res) => {
    res.status(404).render('index', {
      layout: false,
      isProd,
      useProdAssets,
      openApiDoc: JSON.stringify(openApiDoc),
      assetDomain,
      cdnDomain,
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
