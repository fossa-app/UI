import * as React from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchUser, selectUser } from 'store/features';
import { ROUTES } from 'shared/constants';
import Loader from 'components/UI/Loader';
import Content from 'layout/Content';

const ProtectedPage: React.FC = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, status } = useAppSelector(selectUser);

  const getUser = async () => {
    dispatch(fetchUser());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getUser();
    }
  }, [status]);

  React.useEffect(() => {
    // TODO: move all auth logic to axios interceptor component
    if (!user && status === 'failed') {
      navigate(ROUTES.login.path);
    }
  }, [user, status]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    return null;
  }

  return <Content>{outlet}</Content>;
};

export default ProtectedPage;
