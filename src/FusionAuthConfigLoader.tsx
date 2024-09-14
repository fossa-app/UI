import * as React from 'react';
import {
  FusionAuthProvider,
  FusionAuthProviderConfig,
} from '@fusionauth/react-sdk';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { getBackendOrigin } from 'shared/helpers';
import { Client } from 'shared/models';
import { FUSION_AUTH_CONFIGS, URLS } from 'shared/constants';
import axios from 'core/axios';
import { useAppDispatch, useAppSelector } from 'store';
import { setClient, selectClient } from 'store/features';
import AxiosInterceptor from './AxiosInterceptor';
import App from './App';

const FusionAuthConfigLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { client } = useAppSelector(selectClient);
  const [config, setConfig] =
    React.useState<FusionAuthProviderConfig>(FUSION_AUTH_CONFIGS);

  const getClient = async (): Promise<void> => {
    const origin = window.location.origin;
    const beOrigin = getBackendOrigin(origin);

    try {
      const { data } = await axios.get<Client>(`
        ${beOrigin}/${URLS.base}/${URLS.client}?origin=${origin}
      `);
      dispatch(setClient(data));
      setConfig({
        ...config,
        clientId: data.clientId,
        redirectUri: origin,
        postLogoutRedirectUri: origin,
      });
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  React.useEffect(() => {
    getClient();
  }, []);

  if (!client) {
    return (
      <Box width="100%">
        <LinearProgress />
      </Box>
    );
  }

  return (
    <FusionAuthProvider {...config}>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </FusionAuthProvider>
  );
};

export default FusionAuthConfigLoader;
