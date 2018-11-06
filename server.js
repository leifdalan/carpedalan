import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';

import webpackConfig from './webpack.config';

const compiler = webpack(webpackConfig);
const app = express();

// webpack hmr

app.use(
  devMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }),
);

app.use(hotMiddleware(compiler));

// static assets
app.use(express.static('dist'));

// main route

// app start up
app.listen(3001);
