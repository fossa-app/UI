import * as React from 'react';
import { useNavigate, useOutlet } from 'react-router-dom';
import { useFusionAuth } from '@fusionauth/react-sdk';
import { ROUTES } from 'shared/constants';
import Content from 'layout/Content';

const Home: React.FC<{}> = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { isLoggedIn, isFetchingUserInfo } = useFusionAuth();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.login.path);
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || isFetchingUserInfo) {
    return null;
  }

  return <Content>{outlet}</Content>;
};

export default Home;
