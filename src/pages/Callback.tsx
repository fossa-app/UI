import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import { getUserManager } from 'shared/helpers';
import Loader from 'components/UI/Loader';

const CallbackPage = () => {
  const navigate = useNavigate();
  const userManager = getUserManager();
  const hasHandledCallback = React.useRef(false);

  const handleSignInCallback = async () => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    try {
      await userManager.signinRedirectCallback();
      navigate(ROUTES.manage.path);
    } catch (error) {
      navigate(ROUTES.login.path);
    }
  };

  React.useEffect(() => {
    handleSignInCallback();
  }, []);

  return <Loader />;
};

export default CallbackPage;
