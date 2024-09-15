import * as React from 'react';
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectIdentity,
  fetchClient,
  selectFusionAuthConfig,
} from 'store/features';
import AxiosInterceptor from './AxiosInterceptor';
import App from './App';

const FusionAuthConfigLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { client, status } = useAppSelector(selectIdentity);
  const { fusionAuthConfig } = useAppSelector(selectFusionAuthConfig);
  const loading = status === 'loading';

  const getClient = async (): Promise<void> => {
    dispatch(fetchClient());
  };

  React.useEffect(() => {
    getClient();
  }, []);

  if (loading || !client) {
    return (
      <Box width="100%">
        <LinearProgress />
      </Box>
    );
  }

  return (
    <FusionAuthProvider {...fusionAuthConfig}>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </FusionAuthProvider>
  );
};

export default FusionAuthConfigLoader;
