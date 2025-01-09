import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

import { defaultValue } from './StaticContext';
import StaticContextProvider from './StaticContextProvider';
import { handleRedirects } from './AppRedirectsConfig';
import App from './App';

export function render (request, reply, helmetContext, staticContext) {
  const { url: location } = request;
  const path = request.urlData('path');
  const isRedirected = handleRedirects(request, location, path, (to, state) => {
    if (state) {
      reply.redirect(`${to}?${new URLSearchParams({ from: location }).toString()}`);
    } else {
      reply.redirect(to);
    }
    return true;
  });
  if (isRedirected) return undefined;
  staticContext.context = {
    ...defaultValue,
    ...staticContext.context,
    env: { ...defaultValue.env, ...staticContext.context.env },
    authContext: { user: request.user?.toJSON() ?? null },
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
