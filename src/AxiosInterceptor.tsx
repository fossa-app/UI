import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { removeUser, selectAuthSettings, setError } from 'store/features';
import axios, { AxiosError, AxiosRequestConfig } from 'shared/configs/axios';
import { getUserFromLocalStorage, getUserManager, parseResponseData } from 'shared/helpers';
import { MESSAGES, ROUTES } from 'shared/constants';
import { ErrorResponseDTO } from 'shared/models';

// TODO: debug, a weird issue takes place when authenticated, the token is not being set and receiving 401, fixes after refresh
const AxiosInterceptor: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const userManager = getUserManager();
  const dispatch = useAppDispatch();
  const { data: authSettings } = useAppSelector(selectAuthSettings);
  const [shouldNavigate, setShouldNavigate] = React.useState(false);

  const refreshToken = React.useCallback(
    async (errorConfig: AxiosRequestConfig): Promise<ErrorResponseDTO | null> => {
      try {
        const user = await userManager.signinSilent();

        if (user?.access_token && errorConfig.headers) {
          errorConfig.headers.Authorization = `${user.token_type} ${user.access_token}`;

          return axios(errorConfig);
        }
      } catch {
        await userManager.removeUser();

        setShouldNavigate(true);
        dispatch(removeUser());

        dispatch(
          setError({
            title: MESSAGES.error.general.unAuthorized,
          })
        );

        return Promise.reject({
          title: MESSAGES.error.general.unAuthorized,
          status: 401,
        });
      }

      return null;
    },
    [dispatch, userManager]
  );

  React.useEffect(() => {
    if (shouldNavigate) {
      navigate(ROUTES.login.path);
    }
  }, [shouldNavigate, navigate]);

  React.useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const { access_token, token_type = 'Bearer' } = getUserFromLocalStorage(authSettings.client_id) || {};

      if (access_token) {
        config.headers.Authorization = `${token_type} ${access_token}`;
      }

      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return {
          ...response,
          data: parseResponseData(response.data),
        };
      },
      async (error: AxiosError) => {
        if (!error.isAxiosError) {
          return Promise.reject(error);
        }

        if (error.response?.data) {
          error.response.data = parseResponseData(error.response.data);
        }

        if (error.code === 'ERR_NETWORK') {
          dispatch(
            setError({
              title: MESSAGES.error.general.network,
            })
          );

          return Promise.reject({
            status: 599,
            title: MESSAGES.error.general.network,
          });
        }

        if (error.config && error.response?.status === 401) {
          return refreshToken(error.config);
        }

        if (error.response && error.response.status >= 500) {
          dispatch(
            setError({
              title: MESSAGES.error.general.common,
            })
          );

          return Promise.reject({
            ...(error.response.data as ErrorResponseDTO),
            title: MESSAGES.error.general.common,
          });
        }

        return Promise.reject(error.response?.data);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authSettings, dispatch, refreshToken]);

  return <>{children}</>;
};

export default AxiosInterceptor;
