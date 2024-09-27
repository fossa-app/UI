import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'core/axios';
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

  axios.interceptors.request.use((config) => {
    const { access_token, token_type } = getFromLocalStorage<AppUser>(AUTH_KEY);

    if (access_token) {
      config.headers.Authorization = `${token_type} ${access_token}`;
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.isAxiosError) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        try {
          const user = await userManager.signinSilent();

          if (user?.access_token) {
            const mappedUser = mapUser(user);

            saveToLocalStorage<AppUser>(AUTH_KEY, mappedUser);
            error.config.headers.Authorization = `${user.token_type} ${user.access_token}`;

            return axios(error.config);
          }
        } catch (renewError) {
          removeFromLocalStorage(AUTH_KEY);
          navigate(ROUTES.login.path);
        }
      }

      return Promise.reject(error);
    }
  );

  return children;
};

export default AxiosInterceptor;
