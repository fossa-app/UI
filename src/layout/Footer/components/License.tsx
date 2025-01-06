import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface LicenseProps {
  isAdmin: boolean;
  setupCompleted: boolean;
  company?: string;
  system?: string;
  onCompanyLicenseClick: () => void;
}

const License: React.FC<LicenseProps> = ({ isAdmin, company, setupCompleted, system = 'Unlicensed System', onCompanyLicenseClick }) => {
  const renderCompanyLicense = () => {
    if (company) {
      return (
        <Typography data-cy="company-license-text" variant="caption" textAlign="right">
          {company}
        </Typography>
      );
    }

    if (setupCompleted && !company) {
      return isAdmin ? (
        <Button
          data-cy="company-license-button"
          aria-label="No License"
          variant="text"
          color="error"
          size="small"
          onClick={onCompanyLicenseClick}
        >
          Unlicensed Company
        </Button>
      ) : (
        <Typography data-cy="company-license-text" color="error" variant="caption" textAlign="right">
          Unlicensed Company
        </Typography>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {renderCompanyLicense()}
      <Typography data-cy="system-license" variant="caption" textAlign="right">
        {system}
      </Typography>
    </Box>
  );
};

export default License;
