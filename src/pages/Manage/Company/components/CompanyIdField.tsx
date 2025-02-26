import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Company } from 'shared/models';
import CopyToClipboard from 'components/UI/CopyToClipboard';

// TODO: refactor to a generic renderCopyableField component
export const renderCompanyIdField = ({ id }: Company) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="body1">{id}</Typography>
    <CopyToClipboard text={`${id}`} />
  </Box>
);
