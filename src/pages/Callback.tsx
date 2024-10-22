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
      navigate(ROUTES.manage.path);
    } catch (error) {
      // TODO: set error state
      // TODO: sometimes POST http://localhost:9011/oauth2/token responses with 400 error after successful login
      navigate(ROUTES.login.path);
    }
  };

  React.useEffect(() => {
    handleSignInCallback();
  }, []);

  return <Loader />;
};

export default CallbackPage;
