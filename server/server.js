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
  pgHost,
  pgUser,
  pgPassword,
  pgDatabase,
  sessionSecret,
  port,
  pgPort,
  isDev,
  isProd,
} from './config';

const app = express();
export const setup = () => {
  // Connect to DB pool
  const pool = new pg.Pool({
    host: pgHost,
    user: pgUser,
    password: pgPassword,
    database: pgDatabase,
    port: pgPort,
  });
  const PgSession = connectPgSimple(session);
  const store = new PgSession({ pool });

  // Setup handlebar view engine
  const viewConfig = {
    extname: '.hbs',
    layoutsDir: path.resolve(__dirname),
    partialsDir: path.resolve(__dirname),
  };
  app.engine('hbs', expbhs(viewConfig));
  app.set('view engine', 'hbs');
  app.set('views', viewConfig.layoutsDir);

  // Setup app to parse cookies and POST requests
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Set up session store

  app.use(
    session({
      store,
      key: 'user_sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 10000 * 60 * 60 * 24 * 30 * 6,
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

  // static assets
  app.use(express.static('dist'));

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
  return { app, store, pool };
};

export const start = expressApp => expressApp.listen(port);

export const stop = expressApp => expressApp.close();
