var webpackMerge = require('webpack-merge');
const path = require('path');
var webpack = require('webpack');

var commonConfig = require('./webpack.config.common');

module.exports = webpackMerge(commonConfig, {
  entry: './src/main.aot.ts',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  module: {
    rules: [
      {
        test: /.ts$/,
        use: [
          {loader: 'awesome-typescript-loader'},
          {loader: 'angular2-template-loader'},
          {loader: 'angular-router-loader?aot=true'}
        ]

      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
});
