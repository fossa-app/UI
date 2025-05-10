import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompanyLicense, fetchSetupData, selectCompanyLicense, selectSetupLoading } from 'store/features';
import { APP_CONFIG } from 'shared/constants';
import CircularLoader from 'components/UI/CircularLoader';

const ManagePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectSetupLoading);
  const { fetchStatus: companyLicenseStatus } = useAppSelector(selectCompanyLicense);

  React.useEffect(() => {
    dispatch(fetchSetupData());
  }, [dispatch]);

  React.useEffect(() => {
    if (companyLicenseStatus === 'idle') {
      dispatch(fetchCompanyLicense());
    }
  }, [companyLicenseStatus, dispatch]);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Box
      sx={{ width: { lg: APP_CONFIG.containerWidth, xs: '100%' }, margin: '0 auto', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <Outlet />
    </Box>
  );
};

export default ManagePage;
