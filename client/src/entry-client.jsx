import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { defaultValue } from './StaticContext';
import StaticContextProvider from './StaticContextProvider';

const container = document.getElementById('root');
const app = (
  <StaticContextProvider value={{ ...defaultValue, ...window.STATIC_CONTEXT }}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StaticContextProvider>
);
if (import.meta.env.NODE_ENV === 'production') {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(<React.StrictMode>{app}</React.StrictMode>);
}
