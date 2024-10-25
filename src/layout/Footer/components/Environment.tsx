import * as React from 'react';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { EnvironmentKind } from 'shared/models';

interface EnvironmentProps {
  kind?: EnvironmentKind;
  name?: string;
}

const Environment: React.FC<EnvironmentProps> = ({ kind, name }) => {
  if (kind === 'Development') {
    return (
      <Tooltip title={name}>
        <Chip data-testid="environment-chip" color="error" size="small" label={kind} />
      </Tooltip>
    );
  }

  if (kind === 'Staging') {
    return (
      <Tooltip title={name}>
        <Typography data-testid="environment-label" variant="caption">
          {kind}
        </Typography>
      </Tooltip>
    );
  }

  return null;
};

export default Environment;
