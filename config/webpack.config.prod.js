'use strict';

const webpackMerge            = require('webpack-merge');
const ngw                     = require('@rush/webpack');
const UglifyJsPlugin          = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano                 = require('cssnano');

const commonConfig            = require('./webpack.config.common');
const helpers                 = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  mode: 'production',

  output: {
    path: helpers.root('dist'),
    publicPath: '/client/',
    filename: '[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),

      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        },
        canPrint: false
      })
    ]
  },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@rush/webpack'
      }
    ]
  },

  plugins: [
    new ngw.AngularCompilerPlugin({
      tsConfigPath: helpers.root('tsconfig.json'),
      entryModules: [
        helpers.root('client', 'admin', 'app.module#AdminAppModule'),
      ]
    })
  ]
});
