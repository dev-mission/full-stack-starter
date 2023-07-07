import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';

import { defaultValue } from './StaticContext';
import StaticContextProvider from './StaticContextProvider';
import { handleRedirects } from './AppRedirectsConfig';
import App from './App';

export function render(req, res, helmetContext, staticContext) {
  const { path, url: location } = req;
  const isRedirected = handleRedirects(req, location, path, (to, state) => {
    if (state) {
      res.redirect(`${to}?${new URLSearchParams({ from: location }).toString()}`);
    } else {
      res.redirect(to);
    }
    return true;
  });
  if (isRedirected) return undefined;
  staticContext.context = {
    ...defaultValue,
    ...staticContext.context,
    env: { ...defaultValue.env, ...staticContext.context.env },
    authContext: { user: req.user?.toJSON() ?? null },
  };
  return ReactDOMServer.renderToString(
    <StaticContextProvider value={staticContext.context}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={location}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StaticContextProvider>
  );
}
