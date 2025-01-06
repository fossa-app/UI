import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchUser, selectUser } from 'store/features';
import { ROUTES } from 'shared/constants';
import Content from 'layout/Content';

const ProtectedPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, status } = useAppSelector(selectUser);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUser());
    } else if (!user && status === 'failed') {
      navigate(ROUTES.login.path);
    }
  }, [user, status, dispatch, navigate]);

  if (status === 'failed') {
    return null;
  }

  return (
    <Content>
      <Outlet />
    </Content>
  );
};

export default ProtectedPage;
