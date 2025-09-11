import * as React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { toggleAppTheme } from 'store/features';
import { setMockState, mockDispatch, resetMockState } from '../store';
import { getUserManager } from '../oidc-client-mock';
import { MockRouterWrapper } from '../test-utils';
import { OnboardingStep } from 'shared/models';
import Header from 'layout/Header';

describe('Header Component', () => {
  beforeEach(() => {
    resetMockState();
    setMockState({
      profile: {
        profile: {
          item: undefined,
        },
      },
      onboarding: {
        company: { item: OnboardingStep.completed, fetchStatus: 'succeeded' },
        employee: { item: OnboardingStep.completed, fetchStatus: 'succeeded' },
      },
      appConfig: { isDarkTheme: true },
      company: { company: { item: { name: 'Test', countryCode: 'UA' } } },
    });
  });

  it('should display dark icon when dark theme is enabled', async () => {
    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const themeButton = await screen.findByTestId('theme-button');
    const darkModeIcon = within(themeButton).getByTestId('DarkModeIcon');

    expect(darkModeIcon).toBeInTheDocument();
  });

  it('should display light icon when dark theme is disabled', async () => {
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

  it('should dispatch action to update theme when the theme button is toggled', async () => {
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

  it('should display the profile name and logout button after login', async () => {
    setMockState({
      profile: { profile: { item: { firstName: 'Test' } } } as any,
    });

    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const avatarButton = await screen.findByLabelText('Avatar');
    fireEvent.click(avatarButton);

    const profileName = await screen.findByTestId('profile-name');
    const logoutButton = await screen.findByTestId('logout-button');

    expect(profileName).toHaveTextContent('Test');
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call signoutRedirect on logout button click', async () => {
    const mockUserManager = getUserManager();

    setMockState({
      profile: { profile: { item: { firstName: 'Test' } } } as any,
    });

    render(
      <MockRouterWrapper>
        <Header />
      </MockRouterWrapper>
    );

    const avatarButton = await screen.findByLabelText('Avatar');
    fireEvent.click(avatarButton);

    const logoutButton = await screen.findByTestId('logout-button');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockUserManager.signoutRedirect).toHaveBeenCalled();
    });
  });
});
