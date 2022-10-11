import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home', () => {
  render(<App />);
  const linkElement = screen.getByText(/Full Stack Starter/i);
  expect(linkElement).toBeInTheDocument();
});
