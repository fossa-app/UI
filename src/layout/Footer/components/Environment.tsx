import * as React from 'react';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { EnvironmentKind } from 'shared/models';

interface EnvironmentProps {
  kind: EnvironmentKind;
}

const Environment: React.FC<EnvironmentProps> = ({ kind }) => {
  if (kind === 'Development') {
    return <Chip data-testid="environment-chip" color="error" size="small" label={kind} />;
  }

  if (kind === 'Staging') {
    return (
      <Typography data-testid="environment-label" variant="caption">
        {kind}
      </Typography>
    );
  }

  return null;
};

export default Environment;
