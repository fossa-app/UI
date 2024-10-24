import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LicenseProps {
  company?: string;
  system?: string;
}

const License: React.FC<LicenseProps> = ({ company = 'Unlicensed Company', system = 'Unlicensed System' }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="caption" textAlign="right">
        {company}
      </Typography>
      <Typography variant="caption" textAlign="right">
        {system}
      </Typography>
    </Box>
  );
};

export default License;
