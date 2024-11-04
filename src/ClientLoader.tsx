import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/system/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchClient, selectClient } from 'store/features';
import Header from 'layout/Header';
import Footer from 'layout/Footer';
import SideBar from 'layout/Sidebar';

const ClientLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: client, status } = useAppSelector(selectClient);
  const loading = status === 'loading';

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClient());
    }
  }, [status]);

  if (loading || !client) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Header />
      <SideBar variant="temporary" />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default ClientLoader;
