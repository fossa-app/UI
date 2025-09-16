import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/system/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { selectClient, selectSystemLicense } from 'store/features';
import { fetchClient, fetchSystemLicense } from 'store/thunks';
import Header from 'layout/Header';
import Footer from 'layout/Footer';
import SideBar from 'layout/Sidebar';
import { SearchProvider } from 'components/Search';
import CircularLoader from 'components/UI/CircularLoader';
import { createLazyComponent } from 'routes/lazy-loaded-component';

const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), {
  title: 'Not found',
  subtitle: 'The Client was not found',
  showActionButton: false,
});

const ClientLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { item: client, fetchStatus: clientStatus } = useAppSelector(selectClient);
  const { fetchStatus: systemLicenseStatus } = useAppSelector(selectSystemLicense);
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

  if (loading) {
    // TODO: combine all loaders
    return <CircularLoader />;
  }

  if (!loading && !client) {
    return NotFoundPage;
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
