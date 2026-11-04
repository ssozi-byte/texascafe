import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the café branding and primary call to action', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: /kim’s texas caffe home/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /good food\. great moments\./i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /explore menu/i })).toBeInTheDocument();
});
