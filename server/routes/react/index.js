const express = require('express');
const fs = require('fs/promises');
const { StatusCodes } = require('http-status-codes');
const path = require('path');

require('@babel/register')({
  only: [
    function only(filepath) {
      return filepath.startsWith(path.resolve(__dirname, '../../../client'));
    },
  ],
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
  plugins: [
    [
      'transform-assets',
      {
        extensions: ['css', 'svg'],
        name: 'static/media/[name].[hash:8].[ext]',
      },
    ],
  ],
});
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');
const App = require('../../../client/src/App').default;

const router = express.Router();

/// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', async (req, res, next) => {
  if (req.accepts('html')) {
    try {
      const { url: location } = req;
      console.log('!!!', location);
      const reactApp = ReactDOMServer.renderToString(React.createElement(StaticRouter, { location }, React.createElement(App)));
      const html = await fs.readFile(path.join(__dirname, '../../../client/build', 'index.html'), { encoding: 'utf8' });
      res.send(html.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`));
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    next();
  }
});

module.exports = router;
