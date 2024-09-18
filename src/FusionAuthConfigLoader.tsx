import * as React from 'react';
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import { ThemeProvider } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from 'core/theme.config';
import { useAppDispatch, useAppSelector } from 'store';
import { selectIdentity, fetchClient, selectConfig } from 'store/features';
import AxiosInterceptor from './AxiosInterceptor';
import App from './App';

const FusionAuthConfigLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { client, status } = useAppSelector(selectIdentity);
  const { fusionAuthConfig, isDarkTheme } = useAppSelector(selectConfig);
  const appTheme = isDarkTheme ? darkTheme : lightTheme;
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
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <FusionAuthProvider {...fusionAuthConfig}>
        <AxiosInterceptor>
          <App />
        </AxiosInterceptor>
      </FusionAuthProvider>
    </ThemeProvider>
  );
};

export default FusionAuthConfigLoader;
