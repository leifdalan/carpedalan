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
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  context: process.cwd(),
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
    new InjectManifest({
      swSrc: './src/sw',
      swDest: 'sw.js',
      maximumFileSizeToCacheInBytes: 10000000,
      // additionalManifestEntries: [
      //   {
      //     url: '/lobster.woff2',
      //   },
      //   {
      //     url: '/montserrat-regular-webfont.woff2',
      //   },
      // ],
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
        ASSET_CDN_DOMAIN: JSON.stringify(process.env.ASSET_CDN_DOMAIN),
        DOMAIN: JSON.stringify(process.env.DOMAIN),
        DEFAULT_POSTS_PER_PAGE: JSON.stringify(
          process.env.DEFAULT_POSTS_PER_PAGE,
        ),
      },
    }),
    new Stylish(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./build/library/library.json'), // eslint-disable-line
    }), // new Eslint({ files: 'src/**/*' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
  stats: 'none',
};
