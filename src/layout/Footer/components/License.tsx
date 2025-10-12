import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { CompanyLicense, Module, SubModule, SystemLicense } from 'shared/types';
import { getTestSelectorByModule } from 'shared/helpers';

const testModule = Module.shared;
const testSubModule = SubModule.license;

interface LicenseProps {
  isAdmin: boolean;
  loading: boolean;
  company?: CompanyLicense['terms']['licensee'];
  system?: SystemLicense['terms']['licensee'];
}

const License: React.FC<LicenseProps> = ({ company, loading, system = { shortName: 'Unlicensed System', longName: '' } }) => {
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
