import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/system/Box';
import { darkTheme, lightTheme } from 'core/theme.config';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchClient, selectAppConfig, selectClient } from 'store/features';
import Loader from 'components/UI/Loader';
import Header from 'layout/Header/Header';
import Footer from 'layout/Footer/Footer';

const ClientLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: client, status } = useAppSelector(selectClient);
  const loading = status === 'loading';
  const appTheme = isDarkTheme ? darkTheme : lightTheme;

  const getClient = async () => {
    dispatch(fetchClient());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getClient();
    }
  }, [status]);

  if (loading || !client) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Header />
        <Box display="flex" flexDirection="column" flexGrow={1} padding={2}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ClientLoader;
