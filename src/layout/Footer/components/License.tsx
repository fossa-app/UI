import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LicenseProps {
  system: string;
  company: string;
}

const License: React.FC<LicenseProps> = ({ system, company }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="caption" textAlign="right">
        {system}
      </Typography>
      <Typography variant="caption" textAlign="right">
        {company}
      </Typography>
    </Box>
  );
};

export default License;
