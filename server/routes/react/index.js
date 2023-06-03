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
const { ADMIN_AUTH_PROTECTED_PATHS, AUTH_PROTECTED_PATHS, REDIRECTS } = require('../../../client/src/AppRedirects');

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
      // check for and perform server-side redirects
      let match;
      // eslint-disable-next-line no-restricted-syntax
      for (const pattern of ADMIN_AUTH_PROTECTED_PATHS) {
        match = matchPath(pattern, urlPath);
        if (match) {
          if (!req.user) {
            res.redirect(`/login?${new URLSearchParams({ from: location }).toString()}`);
            return;
          }
          if (!req.user.isAdmin) {
            res.redirect('/');
            return;
          }
          break;
        }
      }
      if (!match) {
        // eslint-disable-next-line no-restricted-syntax
        for (const pattern of AUTH_PROTECTED_PATHS) {
          match = matchPath(pattern, urlPath);
          if (match) {
            if (!req.user) {
              res.redirect(`/login?${new URLSearchParams({ from: location }).toString()}`);
              return;
            }
            break;
          }
        }
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const redirect of REDIRECTS) {
        const [src] = redirect;
        let [, dest] = redirect;
        match = matchPath(src, urlPath);
        if (match) {
          if (match.params) {
            // eslint-disable-next-line no-restricted-syntax
            for (const key of Object.keys(match.params)) {
              dest = dest.replace(`:${key}`, match.params[key]);
            }
          }
          if (dest !== src) {
            res.redirect(dest);
          }
          break;
        }
      }
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
