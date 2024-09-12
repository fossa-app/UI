import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders initial text', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const textElement = screen.getByText('Fossa');
  expect(textElement).toBeInTheDocument();
});
