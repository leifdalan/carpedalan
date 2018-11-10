import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../webpack.config';

import devMiddlewareConfig from './devMiddleware.config';

// eslint-disable-next-line
export const applyWebpackMiddleware = app => {
  const compiler = webpack(webpackConfig);
  app.use(devMiddleware(compiler, devMiddlewareConfig));
  app.use(hotMiddleware(compiler));
};
