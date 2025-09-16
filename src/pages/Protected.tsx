import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/system/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { selectUser } from 'store/features';
import { fetchUser } from 'store/thunks';
import { ROUTES } from 'shared/constants';

const ProtectedPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { item: user, fetchStatus } = useAppSelector(selectUser);

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchUser());
    } else if (!user && fetchStatus === 'failed') {
      navigate(ROUTES.login.path);
    }
  }, [user, fetchStatus, dispatch, navigate]);

  if (fetchStatus === 'failed') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Outlet />
    </Box>
  );
};

export default ProtectedPage;
