import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import ProfileRouteGuard from 'routes/guards/ProfileRouteGuard';

const ProfilePage: React.FC = () => {
  return (
    <ProfileRouteGuard>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Outlet />
      </Box>
    </ProfileRouteGuard>
  );
};

export default ProfilePage;
