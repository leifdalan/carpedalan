/*
    ./webpack.config.js
*/
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const webpack = require('webpack');

module.exports = {
  context: process.cwd(),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    library: [
      'lodash',
      'axios',
      'date-fns',
      'debug',
      'qs',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'react-virtualized-auto-sizer',
      'react-window',
      'react-window-infinite-loader',
      'styled-components',
    ],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './build/library'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: './build/library/[name].json',
    }),
  ],
};
