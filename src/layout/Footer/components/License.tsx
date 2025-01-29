import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { CompanyLicense, SystemLicense } from 'shared/models';

interface LicenseProps {
  isAdmin: boolean;
  setupCompleted: boolean;
  company?: CompanyLicense['terms']['licensee'];
  system?: SystemLicense['terms']['licensee'];
  onCompanyLicenseClick: () => void;
}

const License: React.FC<LicenseProps> = ({
  isAdmin,
  company,
  setupCompleted,
  system = { shortName: 'Unlicensed System', longName: '' },
  onCompanyLicenseClick,
}) => {
  const renderCompanyLicense = () => {
    if (company) {
      return (
        <Tooltip title={company.longName}>
          <Typography data-cy="company-license-text" variant="caption" textAlign="right">
            {company.shortName}
          </Typography>
        </Tooltip>
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
      <Tooltip title={system.longName}>
        <Typography data-cy="system-license" variant="caption" textAlign="right">
          {system.shortName}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default License;
