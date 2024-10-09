import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import { getUserManager } from 'shared/helpers';
import Loader from 'components/UI/Loader';

const CallbackPage = () => {
  const navigate = useNavigate();
  const userManager = getUserManager();

  const handleSignInCallback = async () => {
    try {
      await userManager.signinRedirectCallback();
      // TODO: sometimes after successfull login, user is not being redirected to setup/company but to setup instead

      navigate(ROUTES.setup.path);
    } catch (error) {
      // TODO: set error state
      // TODO: move all auth logic to axios interceptor component
      navigate(ROUTES.login.path);
    }
  };

  React.useEffect(() => {
    handleSignInCallback();
  }, []);

  return <Loader />;
};

export default CallbackPage;
