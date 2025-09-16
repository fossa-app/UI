import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { resetMockState, setMockState } from '../store';
import { CompanyLicense, SystemLicense } from 'shared/models';
import Environment from 'layout/Footer/components/Environment';
import Footer from 'layout/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    resetMockState();
    setMockState({
      license: {
        system: {
          item: {
            entitlements: { environmentKind: 'Development' },
            terms: { licensee: { longName: 'Test System Licensee', shortName: 'TSL' } },
          } as SystemLicense,
        },
        company: {
          item: { entitlements: {}, terms: { licensee: { longName: 'Test System Licensee', shortName: 'TCL' } } } as CompanyLicense,
        },
      },
    });
  });

  it('should render the system logo correctly', async () => {
    render(<Footer />);

    const appLogo = await screen.findByTestId('app-logo');

    expect(appLogo).toHaveTextContent('Fossa');
  });

  it('should render error Chip for Development environment', async () => {
    render(<Environment kind="Development" name="Test" />);

    const chipElement = await screen.findByTestId('environment-chip');

    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveClass('MuiChip-colorError');
  });

  it('should render Typography for Staging environment', async () => {
    render(<Environment kind="Staging" name="Test" />);
    const labelElement = await screen.findByTestId('environment-label');

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent('Staging');
  });

  it('should render nothing for other environments', () => {
    render(<Environment kind="Production" name="Test" />);

    const labelElement = screen.queryByTestId('environment-label');
    const chipElement = screen.queryByTestId('environment-chip');

    expect(labelElement).not.toBeInTheDocument();
    expect(chipElement).not.toBeInTheDocument();
  });
});
