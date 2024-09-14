import * as React from 'react';
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectIdentity,
  getClient,
  selectFusionAuthConfig,
} from 'store/features';
import AxiosInterceptor from './AxiosInterceptor';
import App from './App';

const FusionAuthConfigLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { client, status } = useAppSelector(selectIdentity);
  const { fusionAuthConfig } = useAppSelector(selectFusionAuthConfig);
  const loading = status === 'loading';

  const fetchClient = async (): Promise<void> => {
    const origin = window.location.origin;

    dispatch(getClient(origin));
  };

  React.useEffect(() => {
    fetchClient();
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
