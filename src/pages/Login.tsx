import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFusionAuth } from '@fusionauth/react-sdk';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import { ROUTES } from 'shared/constants';

const Login: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isFetchingUserInfo, startLogin } = useFusionAuth();

  const handleLogin = (): void => {
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <Card sx={{ width: 320 }}>
        <CardHeader
          title="Login"
          avatar={<LockIcon color="primary" />}
          titleTypographyProps={{
            fontSize: 20,
          }}
        />
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Login;
