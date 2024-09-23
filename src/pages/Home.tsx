import * as React from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { useAppDispatch, useAppSelector } from 'store';
import { ROUTES } from 'shared/constants';
import { fetchUser, selectUser } from 'store/features';
import Content from 'layout/Content';

const Home: React.FC<{}> = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, status } = useAppSelector(selectUser);

  const getUser = async (): Promise<void> => {
    dispatch(fetchUser());
  };

  React.useEffect(() => {
    getUser();
  }, []);

  React.useEffect(() => {
    if (!user && status === 'failed') {
      navigate(ROUTES.login.path);
    }
  }, [user, status]);

  if (status === 'loading') {
    return <LinearProgress />;
  }

  if (status === 'failed') {
    return null;
  }

  return <Content>{outlet}</Content>;
};

export default Home;
