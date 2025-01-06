import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useViewDetailsContext } from './ViewDetailsContext';

const ViewDetailsHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsHeader must be used within a ViewDetails component using ViewDetailsContext.');
  }

  const { module, subModule } = useViewDetailsContext();

  return (
    <AppBar position="static" component="header" color="primary" data-cy={`${module}-${subModule}-view-details-header`}>
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
};

export default ViewDetailsHeader;
