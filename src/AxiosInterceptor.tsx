import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosRequestConfig } from 'core/axios.config';
import { useAppDispatch, useAppSelector } from 'store';
import { removeUser, selectAuthSettings } from 'store/features';
import { getUserFromLocalStorage, getUserManager } from 'shared/helpers';
import { APP_CONFIG, ROUTES } from 'shared/constants';
import { ErrorResponse } from 'shared/models';
import Snackbar from 'components/UI/Snackbar';

interface AxiosInterceptorProps {
  children: React.ReactElement;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const userManager = getUserManager();
  const dispatch = useAppDispatch();
  const { data: authSettings } = useAppSelector(selectAuthSettings);
  const [shouldNavigate, setShouldNavigate] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleClose = () => {
    setShowSnackbar(false);
  };

  const refreshToken = async (errorConfig: AxiosRequestConfig): Promise<ErrorResponse | null> => {
    try {
      const user = await userManager.signinSilent();

      if (user?.access_token && errorConfig.headers) {
        errorConfig.headers.Authorization = `${user.token_type} ${user.access_token}`;

        return axios(errorConfig);
      }
    } catch (error) {
      await userManager.removeUser();

      setShouldNavigate(true);
      setShowSnackbar(true);
      setErrorMessage(APP_CONFIG.errorMessages.unAuthorized);
      dispatch(removeUser());

      return Promise.reject({
        title: APP_CONFIG.errorMessages.unAuthorized,
        status: 401,
      });
    }

    return null;
  };

  React.useEffect(() => {
    if (shouldNavigate) {
      navigate(ROUTES.login.path);
    }
  }, [shouldNavigate, navigate]);

  React.useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const { access_token, token_type } = getUserFromLocalStorage(authSettings.client_id);

      if (access_token) {
        config.headers.Authorization = `${token_type} ${access_token}`;
      }

      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (!error.isAxiosError) {
          return Promise.reject(error);
        }

        // TODO: double check this
        if (!error.response || error.code === 'ERR_NETWORK') {
          setErrorMessage(APP_CONFIG.errorMessages.network);
          setShowSnackbar(true);

          return Promise.reject({
            status: 599,
            title: APP_CONFIG.errorMessages.network,
          });
        }

        if (error.config && error.response?.status === 401) {
          return refreshToken(error.config);
        }

        if (error.response && error.response.status >= 500) {
          setErrorMessage(APP_CONFIG.errorMessages.general);
          setShowSnackbar(true);

          return Promise.reject({
            ...(error.response.data as ErrorResponse),
            title: APP_CONFIG.errorMessages.general,
          });
        }

        return Promise.reject(error.response?.data);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authSettings]);

  return (
    <>
      {children}
      <Snackbar type="error" open={showSnackbar} message={errorMessage} onClose={handleClose} />
    </>
  );
};

export default AxiosInterceptor;
