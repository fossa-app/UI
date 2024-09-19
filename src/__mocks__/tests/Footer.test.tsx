import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Environment from '../../layout/Footer/components/Environment';

describe('Footer Component', () => {
  it('should render error Chip for Development environment', async () => {
    render(<Environment kind="Development" />);

    const chipElement = await screen.findByTestId('environment-chip');

    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveClass('MuiChip-colorError');
  });

  it('should render Typography for Staging environment', async () => {
    render(<Environment kind="Staging" />);
    const labelElement = await screen.findByTestId('environment-label');

    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent('Staging');
  });

  it('should render nothing for other environments', () => {
    render(<Environment kind="Production" />);

    const labelElement = screen.queryByTestId('environment-label');
    const chipElement = screen.queryByTestId('environment-chip');

    expect(labelElement).not.toBeInTheDocument();
    expect(chipElement).not.toBeInTheDocument();
  });
});
