import * as React from 'react';
import Chip from '@mui/material/Chip';
import { EnvironmentKind } from 'shared/models';

interface EnvironmentProps {
  kind: EnvironmentKind;
}

const Environment: React.FC<EnvironmentProps> = ({ kind }) => {
  const colorMap: Record<EnvironmentKind, 'error' | 'warning' | 'success'> = {
    Development: 'error',
    Staging: 'warning',
    Production: 'success',
  };

  const chipColor = colorMap[kind] || 'error';

  return <Chip label={kind} color={chipColor} />;
};

export default Environment;
