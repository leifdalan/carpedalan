/*
    ./webpack.config.js
*/
const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const AutoDllPlugin = require('autodll-webpack-plugin');
const HappyPack = require('happypack');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  inject: true,
});

module.exports = {
  mode: 'development',
  devtool: 'eval',
  entry: {
    client: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './src/mount',
    ],
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
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
        use: 'happypack/loader?id=jsx',
      },
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    new HappyPack({
      id: 'jsx',
      threads: 6,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new AutoDllPlugin({
    //   inject: true,
    //   filename: '[name].dll.js',
    //   entry: {
    //     vendor: [
    //       'react',
    //       'react-dom',
    //       'lodash',
    //       'moment',
    //       'react-router-dom',
    //       'react-router',
    //       'superagent',
    //     ],
    //   },
    // }),
  ],
};
