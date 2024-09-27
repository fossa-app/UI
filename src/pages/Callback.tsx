import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { ROUTES } from 'shared/constants';
import { getUserManager } from 'store/features';

const Callback = () => {
  const navigate = useNavigate();
  const userManager = getUserManager();

  React.useEffect(() => {
    const handleSignInCallback = async (): Promise<void> => {
      try {
        await userManager.signinRedirectCallback();

        navigate(ROUTES.home.path);
      } catch (error) {
        // TODO: set error state
        navigate(ROUTES.login.path);
      }
    };

    handleSignInCallback();
  }, [navigate, userManager]);

  return <LinearProgress />;
};

export default Callback;
