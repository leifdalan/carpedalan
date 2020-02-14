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
  context: path.resolve(__dirname),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    client: [
      'webpack-hot-middleware/client?path=//local.carpedalan.com/__webpack_hmr&timeout=20000&noInfo=true&quiet=true',
      '@babel/polyfill',
      './src/mount',
    ],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '//local.carpedalan.com/dist/',
  },
  resolve: {
    /** Base directories that Webpack will look to resolve absolutely imported modules */
    modules: ['src', 'node_modules'],
    /** Extension that are allowed to be omitted from import statements */
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    /** "main" fields in package.json files to resolve a CommonJS module for */
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.tsx?$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     eslintPath: path.join(__dirname, '.eslinzztrc.js'),
      //   },
      // },
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
      },
    }),
    new Stylish(),
    // new Eslint({ files: 'src/**/*' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  // devServer: {
  //   stats: 'none',
  // },
  // stats: 'none',
};
