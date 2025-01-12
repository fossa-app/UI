import * as React from 'react';
import Box from '@mui/material/Box';
import { useViewDetailsContext } from './ViewDetailsContext';

const ViewDetailsActions: React.FC<React.PropsWithChildren> = ({ children }) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsActions must be used within a ViewDetails component using ViewDetailsContext.');
  }

  return <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 6 }}>{children}</Box>;
};

export default ViewDetailsActions;
