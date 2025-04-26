import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { CompanyLicense, Module, SubModule, SystemLicense } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';

const testModule = Module.shared;
const testSubModule = SubModule.license;

interface LicenseProps {
  isAdmin: boolean;
  setupCompleted: boolean;
  loading: boolean;
  company?: CompanyLicense['terms']['licensee'];
  system?: SystemLicense['terms']['licensee'];
  onCompanyLicenseClick: () => void;
}

const License: React.FC<LicenseProps> = ({
  isAdmin,
  company,
  setupCompleted,
  loading,
  system = { shortName: 'Unlicensed System', longName: '' },
  onCompanyLicenseClick,
}) => {
  const renderCompanyLicense = () => {
    if (loading) {
      return null;
    }

    if (company) {
      return (
        <Tooltip title={company.longName}>
          <Typography
            data-cy={getTestSelectorByModule(testModule, testSubModule, 'company-license-text')}
            variant="caption"
            textAlign="right"
          >
            {company.shortName}
          </Typography>
        </Tooltip>
      );
    }

    if (setupCompleted && !company) {
      return isAdmin ? (
        <Button
          data-cy={getTestSelectorByModule(testModule, testSubModule, 'company-license-button')}
          aria-label="No License"
          variant="text"
          color="error"
          size="small"
          onClick={onCompanyLicenseClick}
        >
          Unlicensed Company
        </Button>
      ) : (
        <Typography
          data-cy={getTestSelectorByModule(testModule, testSubModule, 'company-license-text')}
          color="error"
          variant="caption"
          textAlign="right"
        >
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
        <Typography data-cy={getTestSelectorByModule(testModule, testSubModule, 'system-license')} variant="caption" textAlign="right">
          {system.shortName}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default License;
