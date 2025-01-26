import * as React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Branch } from 'shared/models';

export const renderBranchTimeZone = (branch: Branch) => (
  <Tooltip title={branch.isValidCompanyTimeZone ? '' : 'Invalid TimeZone'}>
    <Typography
      variant="body2"
      {...(!branch.isValidCompanyTimeZone && { 'data-invalid': true })}
      sx={{
        color: branch.isValidCompanyTimeZone ? 'inherit' : (theme) => theme.palette.error.main,
        width: 'fit-content',
      }}
    >
      {branch.timeZoneName}
    </Typography>
  </Tooltip>
);
