import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from 'core/theme.config';
import { useAppDispatch, useAppSelector } from 'store';
import { selectIdentity, fetchClient, selectAppConfig } from 'store/features';
import AxiosInterceptor from './AxiosInterceptor';
import App from './App';

const ClientLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { client, status } = useAppSelector(selectIdentity);
  const { isDarkTheme } = useAppSelector(selectAppConfig);
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
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </ThemeProvider>
  );
};

export default ClientLoader;
