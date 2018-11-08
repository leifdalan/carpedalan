import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import winston from 'winston';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import router from './routes';
import webpackConfig from './webpack.config';

const compiler = webpack(webpackConfig);
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  }),
);

app.use(
  devMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      // Add asset Information
      assets: true,

      // Sort assets by a field
      // You can reverse the sort with `!field`.
      // Some possible values: 'id' (default), 'name', 'size', 'chunks', 'failed', 'issuer'
      // For a complete list of fields see the bottom of the page
      assetsSort: 'field',

      // Add build date and time information
      builtAt: true,

      // Add information about cached (not built) modules
      cached: false,

      // Show cached assets (setting this to `false` only shows emitted files)
      cachedAssets: false,

      // Add children information
      children: false,

      // Add chunk information (setting this to `false` allows for a less verbose output)
      chunks: false,

      // Add namedChunkGroups information
      chunkGroups: false,

      // Add built modules information to chunk information
      chunkModules: false,

      // Add the origins of chunks and chunk merging info
      chunkOrigins: true,

      // Sort the chunks by a field
      // You can reverse the sort with `!field`. Default is `id`.
      // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
      // For a complete list of fields see the bottom of the page

      // `webpack --colors` equivalent
      colors: true,

      // Display the distance from the entry point for each module
      depth: false,

      // Display the entry points with the corresponding bundles
      entrypoints: false,

      // Add --env information
      env: false,

      // Add errors
      errors: true,
      // Add the hash of the compilation
      hash: false,

      // Set the maximum number of modules to be shown
      maxModules: 15,

      // Add built modules information
      modules: false,

      // Sort the modules by a field
      // You can reverse the sort with `!field`. Default is `id`.
      // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
      // For a complete list of fields see the bottom of the page
      modulesSort: 'field',

      // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
      moduleTrace: true,

      // Show performance hint when file size exceeds `performance.maxAssetSize`
      performance: true,

      // Show the exports of the modules
      providedExports: false,

      // Add public path information
      publicPath: false,

      // Add information about the reasons why modules are included
      reasons: true,

      // Add the source code of modules
      source: false,

      // Add timing information
      timings: true,

      // Show which exports of a module are used
      usedExports: false,

      // Add webpack version information
      version: true,

      // Add warnings
      warnings: true,
    },
  }),
);

app.use(hotMiddleware(compiler));
// express-winston logger makes sense BEFORE the router
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
// static assets
app.use(express.static('dist'));

router(app);
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
app.listen(3001);
