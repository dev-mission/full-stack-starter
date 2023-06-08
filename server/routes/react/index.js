const express = require('express');
const fs = require('fs');
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
const { matchPath } = require('react-router-dom');
const { StaticRouter } = require('react-router-dom/server');
const { HelmetProvider } = require('react-helmet-async');

const { defaultValue: defaultStaticContext, StaticContextProvider } = require('../../../client/src/StaticContext');
const App = require('../../../client/src/App').default;
const { handleRedirects } = require('../../../client/src/AppRedirects');

const router = express.Router();

function readIndexFile() {
  const filePath = path.join(__dirname, '../../../client/build', 'index.html');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  }
  return '';
}
const HTML = readIndexFile();

// serve up the client app for all other routes, per SPA client-side routing
router.get('/*', async (req, res, next) => {
  if (req.accepts('html')) {
    try {
      const { path: urlPath, url: location } = req;
      const isRedirected = handleRedirects(req, location, urlPath, (to, state) => {
        if (state) {
          res.redirect(`${to}?${new URLSearchParams({ from: location }).toString()}`);
        } else {
          res.redirect(to);
        }
        return true;
      });
      if (isRedirected) return;
      const staticContext = { ...defaultStaticContext, authContext: { user: req.user?.toJSON() ?? null } };
      const helmetContext = {};
      const reactApp = ReactDOMServer.renderToString(
        React.createElement(
          StaticContextProvider,
          { value: staticContext },
          React.createElement(
            HelmetProvider,
            { context: helmetContext },
            React.createElement(StaticRouter, { location }, React.createElement(App))
          )
        )
      );
      const { helmet } = helmetContext;
      res.send(
        HTML.replace(/<title\b[^>]*>(.*?)<\/title>/i, helmet.title.toString())
          .replace('window.STATIC_CONTEXT={}', `window.STATIC_CONTEXT=${JSON.stringify(staticContext)}`)
          .replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
      );
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    next();
  }
});

module.exports = router;
