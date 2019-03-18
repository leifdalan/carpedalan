/*
    ./webpack.config.js
*/
const path = require('path');

const webpack = require('webpack');
// const HappyPack = require('happypack');
const Stylish = require('webpack-stylish');

module.exports = {
  context: path.resolve(__dirname),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    client: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&noInfo=true&quiet=true',
      './src/mount',
    ],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
        CDN_DOMAIN: JSON.stringify(process.env.CDN_DOMAIN),
      },
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          LOG_LEVEL: JSON.stringify('silly'),
        },
      },
    }),
    new Stylish(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    stats: 'none',
  },
  stats: 'none',
};
