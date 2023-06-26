import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "Rewards Per Customer" heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Rewards Per Customer/i);
  expect(headingElement).toBeInTheDocument();
});
