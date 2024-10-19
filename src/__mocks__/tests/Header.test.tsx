import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { updateAppConfig } from 'store/features';
import { setMockState, mockDispatch, resetMockState } from '../store';
import { getUserManager } from '../oidc-client-mock';
import { SetupStep } from 'shared/models';
import Header from 'layout/Header/Header';

describe('Header Component', () => {
  beforeEach(() => {
    resetMockState();
    setMockState({
      auth: {
        user: {
          data: null,
        },
      },
      setup: {
        company: { data: { name: 'Test' } },
        step: { data: SetupStep.COMPLETED, status: 'succeeded' },
      },
      appConfig: { isDarkTheme: true },
    });
  });

  it('should display dark theme switch as checked when dark theme is enabled', async () => {
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    expect(themeSwitch).toHaveClass('Mui-checked');
  });

  it('should display dark theme switch as unchecked when dark theme is disabled', async () => {
    setMockState({ appConfig: { isDarkTheme: false } });

    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    expect(themeSwitch).not.toHaveClass('Mui-checked');
  });

  it('should dispatch action to update theme when switch is toggled', async () => {
    setMockState({ appConfig: { isDarkTheme: false } });

    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    fireEvent.click(themeSwitch);

    expect(mockDispatch).toHaveBeenCalledWith(updateAppConfig({ isDarkTheme: true }));
  });

  it('should display the user name and logout button after login', async () => {
    setMockState({
      auth: { user: { data: { profile: { given_name: 'Test' } } } } as any,
    });

    render(<Header />);

    const userName = await screen.findByTestId('user-name');
    const logoutButton = await screen.findByTestId('logout-button');

    expect(userName).toHaveTextContent('Test');
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call signoutRedirect on logout button click', async () => {
    const mockUserManager = getUserManager();

    setMockState({
      auth: { user: { data: { profile: { given_name: 'Test' } } } } as any,
    });

    render(<Header />);

    const userMenuButton = await screen.findByTestId('user-menu');

    fireEvent.click(userMenuButton);

    const logoutButton = await screen.findByTestId('logout-button');

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockUserManager.signoutRedirect).toHaveBeenCalled();
    });
  });
});
