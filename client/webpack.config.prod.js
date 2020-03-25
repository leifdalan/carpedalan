/*
    ./webpack.config.js
*/
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const BrotliPlugin = require('brotli-webpack-plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Manifest = require('webpack-manifest-plugin');
const Stylish = require('webpack-stylish');
const { InjectManifest } = require('workbox-webpack-plugin');
// const S3Plugin = require('webpack-s3-plugin');

const isProdBuildForLocal = process.env.PROD_BUILD === 'true';
module.exports = {
  context: path.resolve(__dirname),
  mode: 'production',
  devtool: 'source-map',
  entry: {
    client: ['./src/mount.prod'],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: ``,
  },
  resolve: {
    /** Base directories that Webpack will look to resolve absolutely imported modules */
    modules: ['src', 'node_modules'],
    /** Extension that are allowed to be omitted from import statements */
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    /** "main" fields in package.json files to resolve a CommonJS module for */
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: ['ts-loader'],
      },
    ],
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules\//,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
        ASSET_CDN_DOMAIN: JSON.stringify(process.env.ASSET_CDN_DOMAIN),
        DOMAIN: JSON.stringify(process.env.DOMAIN),
        DEFAULT_POSTS_PER_PAGE: JSON.stringify(
          process.env.DEFAULT_POSTS_PER_PAGE,
        ),
      },
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    new InjectManifest({
      swSrc: './src/sw',
      swDest: 'sw.js',
      // additionalManifestEntries: [
      //   {
      //     url: '/lobster.woff2',
      //   },
      //   {
      //     url: '/montserrat-regular-webfont.woff2',
      //   },
      // ],
    }),

    new BrotliPlugin({
      test: /((?!sw).*.(js|map))$/,
      asset: '[path]',
    }),

    new Manifest({
      fileName: `manifest.json`,
    }),

    new Stylish(),
    ...(isProdBuildForLocal
      ? []
      : [
          // new S`3Plugin({
          //   // s3Options are required
          //   s3Options: {
          //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          //     region: 'us-west-2',
          //   },
          //   s3UploadOptions: {
          //     Bucket: process.env.S3_ASSETS_BUCKET,
          //     ContentEncoding: 'gzip',
          //   },
          // }),
        ]),
  ],
};
