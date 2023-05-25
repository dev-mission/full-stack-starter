import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { defaultValue, StaticContextProvider } from './StaticContext';
import reportWebVitals from './reportWebVitals';

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
if (process.env.NODE_ENV === 'development') {
  createRoot(container).render(<React.StrictMode>{app}</React.StrictMode>);
} else {
  hydrateRoot(container, app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
