'use strict';

const CleanWebpackPlugin   = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleTracker        = require('webpack-bundle-tracker')
const webpack              = require('webpack');

const helpers              = require('./helpers');
const isDev                = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    admin: './client/admin.ts',
    site: './client/site.ts'
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: isDev } },
          { loader: 'sass-loader', options: { sourceMap: isDev } }
        ],
        include: helpers.root('client', 'site')
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'to-string-loader',
          { loader: 'css-loader', options: { sourceMap: isDev } },
          { loader: 'sass-loader', options: { sourceMap: isDev } }
        ],
        include: [
          helpers.root('client', 'admin'),
          helpers.root('client', 'shared')
        ]
      }
    ]
  },

  plugins: [
    //// fix "the request of a dependency is an expression" warning
    //// https://github.com/angular/angular/issues/20357
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /\@angular(\\|\/)core(\\|\/)fesm5/,
      helpers.root('src')
    ),
    new CleanWebpackPlugin(
      helpers.root('dist'), { root: helpers.root(), verbose: true }
    ),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new BundleTracker({filename: './client/webpack-stats.json'})
  ]
};
