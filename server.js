const path = require('path');

const express = require('express');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('./webpack.config');

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
