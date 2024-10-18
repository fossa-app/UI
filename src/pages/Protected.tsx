import * as React from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSetupData, fetchUser, selectStep, selectUser } from 'store/features';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';
import Content from 'layout/Content';

const ProtectedPage: React.FC = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, status: fetchUserStatus } = useAppSelector(selectUser);
  const { status: stepStatus } = useAppSelector(selectStep);
  const loading = fetchUserStatus === 'loading' || stepStatus === 'loading';

  React.useEffect(() => {
    if (fetchUserStatus === 'idle') {
      dispatch(fetchUser());
    } else if (!user && fetchUserStatus === 'failed') {
      navigate(ROUTES.login.path);
    }
  }, [user, fetchUserStatus]);

  React.useEffect(() => {
    if (stepStatus === 'idle') {
      dispatch(fetchSetupData());
    } else if (stepStatus === 'failed') {
      navigate(ROUTES.setup.path);
    } else if (stepStatus === 'succeeded') {
      navigate(ROUTES.dashboard.path);
    }
  }, [stepStatus]);

  if (loading) {
    return <Loader />;
  }

  if (fetchUserStatus === 'failed') {
    return null;
  }

  return <Content>{outlet}</Content>;
};

export default ProtectedPage;
