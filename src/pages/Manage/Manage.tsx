import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompanyLicense, fetchSetupData, selectCompanyLicense, selectStep } from 'store/features';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';

const ManagePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector(selectStep);
  const { status: companyLicenseStatus } = useAppSelector(selectCompanyLicense);

  React.useEffect(() => {
    if (status === 'idle') {
      // TODO: Do not fetch setup data here, instead navigate to /setup if entities do not exist
      dispatch(fetchSetupData());
    } else if (status === 'failed') {
      navigate(ROUTES.setup.path);
    }
  }, [status, dispatch, navigate]);

  React.useEffect(() => {
    if (companyLicenseStatus === 'idle') {
      dispatch(fetchCompanyLicense());
    }
  }, [companyLicenseStatus]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'idle' || status === 'failed') {
    return null;
  }

  return (
    <Box sx={{ width: { lg: 1160, xs: '100%' }, margin: '0 auto', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Outlet />
    </Box>
  );
};

export default ManagePage;
