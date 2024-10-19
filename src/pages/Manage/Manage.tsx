import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSetupData, selectStep } from 'store/features';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';

const ManagePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector(selectStep);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSetupData());
    } else if (status === 'failed') {
      navigate(ROUTES.setup.path);
    }
  }, [status, dispatch, navigate]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'idle' || status === 'failed') {
    return null;
  }

  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default ManagePage;
