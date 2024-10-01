import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import { getUserManager } from 'shared/helpers';

const LoginPage: React.FC<{}> = () => {
  const userManager = getUserManager();

  const handleLogin = async (): Promise<void> => {
    await userManager.signinRedirect();
  };

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
            variant: 'h5',
          }}
        />
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', padding: 2 }}>
          <Button
            data-testid="login-button"
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default LoginPage;
