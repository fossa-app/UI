import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { toggleAppTheme } from 'store/features';
import { setMockState, mockDispatch, resetMockState } from '../store';
import { getUserManager } from '../oidc-client-mock';
import { MockRouterWrapper } from '../test-utils';
import { SetupStep } from 'shared/models';
import Header from 'layout/Header';

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
        step: { data: SetupStep.COMPLETED, status: 'succeeded' },
      },
      appConfig: { isDarkTheme: true },
      company: { company: { data: { name: 'Test' } } },
    });
  });

  it('should display dark theme switch as checked when dark theme is enabled', async () => {
    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const themeButton = await screen.findByTestId('theme-button');
    const darkModeIcon = within(themeButton).getByTestId('DarkModeIcon');

    expect(darkModeIcon).toBeInTheDocument();
  });

  it('should display dark theme switch as unchecked when dark theme is disabled', async () => {
    setMockState({ appConfig: { isDarkTheme: false } });

    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const themeButton = await screen.findByTestId('theme-button');
    const lightModeIcon = within(themeButton).getByTestId('LightModeIcon');

    expect(lightModeIcon).toBeInTheDocument();
  });

  it('should dispatch action to update theme when switch is toggled', async () => {
    setMockState({ appConfig: { isDarkTheme: false } });

    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const themeButton = await screen.findByTestId('theme-button');

    fireEvent.click(themeButton);

    expect(mockDispatch).toHaveBeenCalledWith(toggleAppTheme(true));
  });

  it('should display the user name and logout button after login', async () => {
    setMockState({
      auth: { user: { data: { profile: { given_name: 'Test' } } } } as any,
    });

    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

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

    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const userMenuButton = await screen.findByTestId('user-menu');

    fireEvent.click(userMenuButton);

    const logoutButton = await screen.findByTestId('logout-button');

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockUserManager.signoutRedirect).toHaveBeenCalled();
    });
  });
});
