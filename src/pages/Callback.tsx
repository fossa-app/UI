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
        // TODO: sometimes after successfull login, user is not being redirected to dashboard but to home instead

        navigate(ROUTES.setup.path);
      } catch (error) {
        // TODO: set error state
        // TODO: move all auth logic to axios interceptor component
        navigate(ROUTES.login.path);
      }
    };

    handleSignInCallback();
  }, [navigate, userManager]);

  return <LinearProgress />;
};

export default Callback;
