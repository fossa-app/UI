import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFusionAuth } from '@fusionauth/react-sdk';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ROUTES } from 'shared/constants';

const Login: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isFetchingUserInfo, startLogin } = useFusionAuth();

  const login = (): void => {
    startLogin('state-from-login');
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate(ROUTES.home.path);
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn || isFetchingUserInfo) {
    return null;
  }

  return (
    <Box>
      <Button variant="contained" onClick={login}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
