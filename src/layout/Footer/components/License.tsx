import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface LicenseProps {
  company?: string;
  system?: string;
  isCompanyLicenseValid: boolean;
  onCompanyLicenseClick: () => void;
}

const License: React.FC<LicenseProps> = ({
  // TODO: move the default values to state
  company = 'Unlicensed Company',
  system = 'Unlicensed System',
  isCompanyLicenseValid,
  onCompanyLicenseClick,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {isCompanyLicenseValid ? (
        <Typography variant="caption" textAlign="right">
          {company}
        </Typography>
      ) : (
        <Button variant="text" color="error" size="small" onClick={onCompanyLicenseClick}>
          {company}
        </Button>
      )}
      <Typography variant="caption" textAlign="right">
        {system}
      </Typography>
    </Box>
  );
};

export default License;
