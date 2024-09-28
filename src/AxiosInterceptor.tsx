import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosRequestConfig } from 'core/axios';
import { getUserManager } from 'store/features';
import {
  getFromLocalStorage,
  mapUser,
  removeFromLocalStorage,
  saveToLocalStorage,
} from 'shared/helpers';
import { AUTH_KEY, ROUTES } from 'shared/constants';
import { AppUser } from 'shared/models';

interface AxiosInterceptorProps {
  children: React.ReactElement;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const userManager = getUserManager();
  const [shouldNavigate, setShouldNavigate] = React.useState(false);

  const refreshToken = async (errorConfig: AxiosRequestConfig) => {
    try {
      const user = await userManager.signinSilent();

      if (user?.access_token && errorConfig.headers) {
        const mappedUser = mapUser(user);

        saveToLocalStorage<AppUser>(AUTH_KEY, mappedUser);
        errorConfig.headers.Authorization = `${user.token_type} ${user.access_token}`;

        return axios(errorConfig);
      }
    } catch (error) {
      await userManager.removeUser();

      removeFromLocalStorage(AUTH_KEY);
      setShouldNavigate(true);
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
      const { access_token, token_type } =
        getFromLocalStorage<AppUser>(AUTH_KEY);

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
  }, []);

  return children;
};

export default AxiosInterceptor;
