import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosRequestConfig } from 'core/axios';
import { useAppDispatch, useAppSelector } from 'store';
import { removeUser, selectAuthSettings } from 'store/features';
import { getUserFromLocalStorage, getUserManager } from 'shared/helpers';
import { ROUTES } from 'shared/constants';
import { ErrorResponse } from 'shared/models';

interface AxiosInterceptorProps {
  children: React.ReactElement;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const userManager = getUserManager();
  const dispatch = useAppDispatch();
  const [shouldNavigate, setShouldNavigate] = React.useState(false);
  const { data: authSettings } = useAppSelector(selectAuthSettings);

  const refreshToken = async (
    errorConfig: AxiosRequestConfig
  ): Promise<ErrorResponse | null> => {
    try {
      const user = await userManager.signinSilent();

      if (user?.access_token && errorConfig.headers) {
        errorConfig.headers.Authorization = `${user.token_type} ${user.access_token}`;

        return axios(errorConfig);
      }
    } catch (error) {
      await userManager.removeUser();

      setShouldNavigate(true);
      dispatch(removeUser());

      return {
        message: 'Token refresh failed. User has been logged out.',
        status: 401,
      } as ErrorResponse;
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
      const { access_token, token_type } = getUserFromLocalStorage(
        authSettings.client_id
      );

      if (access_token) {
        config.headers.Authorization = `${token_type} ${access_token}`;
      }

      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.config && error.response?.status === 401) {
          return refreshToken(error.config);
        }

        if (!error.isAxiosError) {
          return Promise.reject(error);
        }

        return Promise.reject(error.response?.data);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authSettings]);

  return children;
};

export default AxiosInterceptor;
