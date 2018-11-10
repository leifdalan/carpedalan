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
  isProd,
} from './config';

const start = async () => {
  const app = express();

  // Connect to DB pool
  const pool = await new pg.Pool({
    host: pgHost,
    user: pgUser,
    password: pgPassword,
    database: pgDatabase,
  });

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
  app.use(bodyParser.urlencoded({ extended: false }));

  // Set up session store
  const PgSession = connectPgSimple(session);
  const store = new PgSession({ pool });

  app.use(
    session({
      store,
      key: 'user_sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000,
      },
    }),
  );

  // Use dev and hot webpack middlewares
  if (!isProd) {
    const { applyWebpackMiddleware } = require('./middlewares'); // eslint-disable-line global-require
    applyWebpackMiddleware(app);
  }

  // express-winston logger BEFORE the router
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

  // app start up
  app.listen(port);
};

start();
