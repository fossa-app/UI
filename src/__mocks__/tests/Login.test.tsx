import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { resetMockState, setMockState } from '../store';
import { getUserManager } from '../oidc-client-mock';
import { MockRouterWrapper } from '../test-utils';
import LoginPage from '../../pages/Login';

describe('Login Component', () => {
  beforeEach(() => {
    resetMockState();
    setMockState({
      auth: {
        user: {
          data: undefined,
        },
      },
    });
  });

  it('should render the login button when not authenticated', async () => {
    render(
      <MockRouterWrapper>
        <LoginPage />
      </MockRouterWrapper>
    );

    const loginButton = await screen.findByTestId('login-button');

    expect(loginButton).toBeInTheDocument();
  });

  it('should call signinRedirect when the login button is clicked', async () => {
    const mockUserManager = getUserManager();

    render(
      <MockRouterWrapper>
        <LoginPage />
      </MockRouterWrapper>
    );

    const loginButton = await screen.findByTestId('login-button');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockUserManager.signinRedirect).toHaveBeenCalled();
    });
  });
});
