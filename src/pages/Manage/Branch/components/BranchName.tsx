import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Branch } from 'shared/models';

export const renderBranchName = (branch: Branch, onClick: (branch: Branch) => void) => (
  <Typography
    variant="body1"
    color="primary"
    sx={{
      cursor: 'pointer',
      width: 'fit-content',
      '&:hover': {
        textDecoration: 'underline',
      },
    }}
    onClick={() => onClick(branch)}
  >
    {branch.name}
  </Typography>
);
