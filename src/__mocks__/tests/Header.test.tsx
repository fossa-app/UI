import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { setConfig } from 'store/features';
import { setMockState, mockDispatch } from '../store';
import { setFusionAuthMock } from '../fusionauth-mock';
import Header from '../../layout/Header/Header';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

describe('Header Component', () => {
  it('should render correctly with logo', async () => {
    render(<Header />);

    const appLogo = await screen.findByTestId('app-logo');

    expect(appLogo).toHaveTextContent('Fossa');
  });

  it('should render correctly with dark theme enabled', async () => {
    setMockState({ config: { isDarkTheme: true } });
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    expect(themeSwitch).toHaveClass('Mui-checked');
  });

  it('should render correctly with dark theme disabled', async () => {
    setMockState({ config: { isDarkTheme: false } });
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    expect(themeSwitch).not.toHaveClass('Mui-checked');
  });

  it('should dispatch setConfig action with updated isDarkTheme value when switch is toggled', async () => {
    setMockState({ config: { isDarkTheme: false } });
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    fireEvent.click(themeSwitch);

    expect(mockDispatch).toHaveBeenCalledWith(setConfig({ isDarkTheme: true }));
  });

  it('should display the user name and the logout button after successful login', async () => {
    setFusionAuthMock({
      isLoggedIn: true,
      userInfo: {
        given_name: 'Test',
      },
    });

    render(<Header />);

    const userName = await screen.findByTestId('user-name');
    const logoutButton = await screen.findByTestId('logout-button');

    expect(userName).toHaveTextContent('Test');
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call startLogout when logout button is clicked', async () => {
    const mockStartLogout = jest.fn();

    setFusionAuthMock({
      isLoggedIn: true,
      userInfo: {
        given_name: 'Test',
      },
      startLogout: mockStartLogout,
    });

    render(<Header />);

    const logoutButton = await screen.findByTestId('logout-button');

    fireEvent.click(logoutButton);

    expect(mockStartLogout).toHaveBeenCalled();
  });
});
