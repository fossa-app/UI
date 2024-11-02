import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface LicenseProps {
  company?: string;
  system?: string;
  setupCompleted: boolean;
  onCompanyLicenseClick: () => void;
}

const License: React.FC<LicenseProps> = ({
  // TODO: move the default values to state
  company,
  system = 'Unlicensed System',
  setupCompleted,
  onCompanyLicenseClick,
}) => {
  const companyLicenseContent = () => {
    if (company) {
      return (
        <Typography data-cy="company-license-text" variant="caption" textAlign="right">
          {company}
        </Typography>
      );
    }

    if (setupCompleted && !company) {
      return (
        <Button data-cy="company-license-button" variant="text" color="error" size="small" onClick={onCompanyLicenseClick}>
          Unlicensed Company
        </Button>
      );
    }

    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {companyLicenseContent()}
      <Typography data-cy="system-license" variant="caption" textAlign="right">
        {system}
      </Typography>
    </Box>
  );
};

export default License;
