import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { defaultValue, StaticContextProvider } from './StaticContext';

export const TestApp = (
  <StaticContextProvider value={defaultValue}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StaticContextProvider>
);

test('renders home', () => {
  render(TestApp);
  const linkElement = screen.getByText(/XR Tour/i);
  expect(linkElement).toBeInTheDocument();
});
