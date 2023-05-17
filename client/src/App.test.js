import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home', () => {
  render(<App />);
  const linkElement = screen.getByText(/XR Tour/i);
  expect(linkElement).toBeInTheDocument();
});
