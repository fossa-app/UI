import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { selectOnboardingLoading } from 'store/features';
import { fetchOnboardingData } from 'store/thunks';
import { APP_CONFIG } from 'shared/constants';
import CircularLoader from 'components/UI/CircularLoader';

const ManagePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectOnboardingLoading);

  React.useEffect(() => {
    dispatch(fetchOnboardingData());
  }, [dispatch]);

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
