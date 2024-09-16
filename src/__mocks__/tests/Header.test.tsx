import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../layout/Header';
import { setConfig } from 'store/features';
import { setMockState, mockDispatch } from '../store';

describe('Header Component', () => {
  it('renders correctly with logo', async () => {
    render(<Header />);

    const appLogo = await screen.findByTestId('app-logo');

    expect(appLogo).toHaveTextContent('Fossa');
  });

  it('renders correctly with dark theme enabled', async () => {
    setMockState({ config: { isDarkTheme: true } });
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    expect(themeSwitch).toHaveClass('Mui-checked');
  });

  it('renders correctly with dark theme disabled', async () => {
    setMockState({ config: { isDarkTheme: false } });
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    expect(themeSwitch).not.toHaveClass('Mui-checked');
  });

  it('dispatches setConfig action with updated isDarkTheme value when switch is toggled', async () => {
    setMockState({ config: { isDarkTheme: false } });
    render(<Header />);

    const themeSwitch = await screen.findByTestId('theme-switch');

    fireEvent.click(themeSwitch);

    expect(mockDispatch).toHaveBeenCalledWith(setConfig({ isDarkTheme: true }));
  });
});
