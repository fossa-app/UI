import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { resetMockState, setMockState } from '../store';
import { getUserManager } from '../oidc-client-mock';
import Login from '../../pages/Login';

beforeEach(() => {
  resetMockState();
  setMockState({
    auth: {
      user: {
        data: null,
      },
    },
  });
});

describe('Login Component', () => {
  it('should render the login button when not authenticated', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = await screen.findByTestId('login-button');

    expect(loginButton).toBeInTheDocument();
  });

  it('should call signinRedirect when the login button is clicked', async () => {
    const mockUserManager = getUserManager();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = await screen.findByTestId('login-button');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockUserManager.signinRedirect).toHaveBeenCalled();
    });
  });
});
