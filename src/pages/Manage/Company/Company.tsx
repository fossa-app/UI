import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import CompanyRouteGuard from 'routes/guards/CompanyRouteGuard';

const CompanyPage: React.FC = () => {
  return (
    <CompanyRouteGuard>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Outlet />
      </Box>
    </CompanyRouteGuard>
  );
};

export default CompanyPage;
