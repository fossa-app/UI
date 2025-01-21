import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/system/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchClient, fetchSystemLicense, selectClient, selectSystemLicense } from 'store/features';
import Header from 'layout/Header';
import Footer from 'layout/Footer';
import SideBar from 'layout/Sidebar';
import { SearchProvider } from 'components/Search';
import CircularLoader from 'components/UI/CircularLoader';

const ClientLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: client, status: clientStatus } = useAppSelector(selectClient);
  const { data: system, status: systemLicenseStatus } = useAppSelector(selectSystemLicense);
  const loading = clientStatus === 'loading' || systemLicenseStatus === 'loading';

  React.useEffect(() => {
    if (clientStatus === 'idle') {
      dispatch(fetchClient());
    }
  }, [clientStatus, dispatch]);

  React.useEffect(() => {
    if (systemLicenseStatus === 'idle') {
      dispatch(fetchSystemLicense());
    }
  }, [systemLicenseStatus, dispatch]);

  if (loading || !client || !system) {
    // TODO: combine all loaders
    return <CircularLoader />;
  }

  return (
    <SearchProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Header />
        <SideBar variant="temporary" />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 4 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </SearchProvider>
  );
};

export default ClientLoader;
