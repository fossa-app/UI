import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders initial text', () => {
  render(<App />);
  const textElement = screen.getByText('Fossa');
  expect(textElement).toBeInTheDocument();
});
