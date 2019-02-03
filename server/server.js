import path from 'path';

import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import expbhs from 'express-handlebars';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

import router from './routes';
import {
  assets,
  cdnDomain,
  isProd,
  ci,
  nodeEnv,
  pgHost,
  pgUser,
  pgPassword,
  pgDatabase,
  sessionSecret,
  port,
  pgPort,
  isDev,
  ssl,
  secureCookie,
} from './config';

const app = express();

// V important
const customHeader = (req, res, next) => {
  res.setHeader('x-powered-by', 'Carpe Dalan');
  next();
};

export const setup = () => {
  // Connect to DB pool
  const pool = new pg.Pool({
    host: pgHost,
    user: pgUser,
    password: pgPassword,
    database: pgDatabase,
    port: pgPort,
    ...(ssl ? { ssl: true } : {}),
  });
  const PgSession = connectPgSimple(session);
  const store = new PgSession({ pool });
  app.set('trust proxy', 1);

  // Setup handlebar view engine
  const viewConfig = {
    extname: '.hbs',
    layoutsDir: path.resolve(__dirname),
    partialsDir: path.resolve(__dirname),
  };
  app.engine('hbs', expbhs(viewConfig));
  app.set('view engine', 'hbs');
  app.set('views', viewConfig.layoutsDir);
  // static assets
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });
  app.use('/dist', express.static('dist'));
  app.use('/public', express.static('public'));
  app.use('/sw.js', express.static('server/sw.js'));

  // Setup app to parse cookies and POST requests
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // V important
  app.use(customHeader);

  // Set up session store
  app.use(
    session({
      store,
      key: 'user_sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 10000 * 60 * 60 * 24 * 30 * 6,
        secure: secureCookie,
        http: true,
      },
    }),
  );
  // Use dev and hot webpack middlewares
  if (isDev) {
    const { applyWebpackMiddleware } = require('./middlewares'); // eslint-disable-line global-require
    applyWebpackMiddleware(app);
  }

  // express-winston logger BEFORE the router
  if (isProd) {
    const { Loggly } = require('winston-loggly-bulk'); // eslint-disable-line global-require
    winston.add(
      new Loggly({
        token: '9841fd82-a324-49ab-8389-bacf0d73d9d9',
        subdomain: 'leifdalan',
        tags: ['Winston-NodeJS'],
        json: true,
      }),
    );
    winston.log('info', 'Logger starting');

    app.use(
      expressWinston.logger({
        expressFormat: true,
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.prettyPrint(),
          winston.format.colorize(),
        ),
      }),
    );
  }

  // Define routes
  router(app);

  if (isProd) {
    const Sentry = require('@sentry/node'); // eslint-disable-line
    Sentry.init({
      dsn: 'https://c5f5ee9e1c904e618af3e609d3fdd7d2@sentry.io/1380082',
    });
    app.use(Sentry.Handlers.errorHandler());
  }
  // Winston error logger
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint(),
      ),
    }),
  );
  app.use((req, res, next, err) => {
    const manifest = require('../dist/manifest.json'); // eslint-disable-line global-require,import/no-unresolved
    const clientAssets = assets.map(asset => manifest[asset]);

    res.status(500).render('index', {
      layout: false,
      isProd,
      session: JSON.stringify(req.session),
      meta: JSON.stringify({
        status: 500,
        cdn: cdnDomain,
        ci,
        nodeEnv,
        error: err,
      }),
      clientAssets,
    });
  });
  return { app, store, pool };
  // return { app };
};

export const start = expressApp => {
  console.log(`Listening on port ${port} `); // eslint-disable-line no-console
  expressApp.listen(port);
};

export const stop = expressApp => expressApp.close();
