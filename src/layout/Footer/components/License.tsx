import * as React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

interface LicenseProps {
  name: string;
}

const License: React.FC<LicenseProps> = ({ name }) => {
  return (
    <Tooltip title={`Licensed to ${name}`}>
      <Typography variant="body2">Fossa</Typography>
    </Tooltip>
  );
};

export default License;
