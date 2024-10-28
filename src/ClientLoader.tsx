import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/system/Box';
import { darkTheme, lightTheme } from 'shared/configs/theme';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchClient, selectAppConfig, selectClient } from 'store/features';
import Header from 'layout/Header';
import Footer from 'layout/Footer';
import SideBar from 'layout/Sidebar';

const ClientLoader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: client, status } = useAppSelector(selectClient);
  const loading = status === 'loading';
  const appTheme = isDarkTheme ? darkTheme : lightTheme;

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClient());
    }
  }, [status]);

  if (loading || !client) {
    return null;
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Header />
        <SideBar variant="temporary" />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 2 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ClientLoader;
