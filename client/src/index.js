import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
if (process.env.NODE_ENV === 'development') {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  hydrateRoot(container, <App />);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
