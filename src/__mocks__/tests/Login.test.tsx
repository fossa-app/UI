import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { setFusionAuthMock } from '../fusionauth-mock';
import Login from '../../pages/Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

describe('Login Component', () => {
  it('should render the login button when isLoggedIn is false and isFetchingUserInfo is false', async () => {
    setFusionAuthMock({
      isLoggedIn: false,
      isFetchingUserInfo: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = await screen.findByTestId('login-button');

    expect(loginButton).toBeInTheDocument();
  });

  it('should navigate to home when isLoggedIn is true', () => {
    setFusionAuthMock({
      isLoggedIn: true,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should not navigate when isLoggedIn is false', () => {
    setFusionAuthMock({
      isLoggedIn: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
