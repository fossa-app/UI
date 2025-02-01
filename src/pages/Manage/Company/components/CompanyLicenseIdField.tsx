import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CompanyLicense } from 'shared/models';
import CopyToClipboard from 'components/UI/CopyToClipboard';

export const renderCompanyLicenseIdField = (license: CompanyLicense) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="body1">{license.entitlements.companyId}</Typography>
    <CopyToClipboard text={`${license.entitlements.companyId}`} />
  </Box>
);
