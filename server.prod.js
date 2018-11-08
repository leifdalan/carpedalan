import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';

import router from './routes';

const app = express();

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
  }),
);
// static assets
app.use(express.static('dist'));

router(app);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
  }),
);

// Optionally you can include your custom error handler after the logging.
app.use(
  express.errorLogger({
    dumpExceptions: true,
    showStack: true,
  }),
);
// app start up
app.listen(3001);
