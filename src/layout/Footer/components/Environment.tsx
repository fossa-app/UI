import * as React from 'react';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { EnvironmentKind } from 'shared/models';

interface EnvironmentProps {
  kind: EnvironmentKind;
}

const Environment: React.FC<EnvironmentProps> = ({ kind }) => {
  if (kind === 'Development') {
    return <Chip label={kind} color="error" data-testid="environment-chip" />;
  }

  if (kind === 'Staging') {
    return (
      <Typography variant="body2" data-testid="environment-label">
        {kind}
      </Typography>
    );
  }

  return null;
};

export default Environment;
