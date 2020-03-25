/*
    ./webpack.config.js
*/
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// const Eslint = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HappyPack = require('happypack');
const webpack = require('webpack');
// const HappyPack = require('happypack');
const Stylish = require('webpack-stylish');

module.exports = {
  context: process.cwd(),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    sw: ['./src/sw'],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '//local.carpedalan.com/dist/',
  },
  resolve: {
    /** Base directories that Webpack will look to resolve absolutely imported modules */
    modules: ['src', 'node_modules'],
    /** Extension that are allowed to be omitted from import statements */
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    /** "main" fields in package.json files to resolve a CommonJS module for */
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'happypack/loader',
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HappyPack({
      loaders: ['babel-loader'],
    }),

    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
        ASSET_CDN_DOMAIN: JSON.stringify(process.env.ASSET_CDN_DOMAIN),
        DEFAULT_POSTS_PER_PAGE: JSON.stringify(
          process.env.DEFAULT_POSTS_PER_PAGE,
        ),
      },
    }),
    new Stylish(),
  ],
  devServer: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
  stats: 'none',
};
