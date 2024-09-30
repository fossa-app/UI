import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/system/Box';
import { darkTheme, lightTheme } from 'core/theme.config';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchClient, selectAppConfig, selectClient } from 'store/features';
import { ROUTES } from 'shared/constants';
import Header from 'layout/Header/Header';
import Footer from 'layout/Footer/Footer';
import Login from 'pages/Login';
import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import Callback from 'pages/Callback';
import Company from 'pages/Company';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useAppSelector(selectAppConfig);
  const { data: client, status } = useAppSelector(selectClient);
  const loading = status === 'loading';
  const appTheme = isDarkTheme ? darkTheme : lightTheme;

  const getClient = async (): Promise<void> => {
    dispatch(fetchClient());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getClient();
    }
  }, [status]);

  // TODO: show the loading spinner dynamically, not only when the client is loading
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
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Header />
        <Box display="flex" flexDirection="column" flexGrow={1} padding={2}>
          <Routes>
            <Route path={ROUTES.login.path} element={<Login />} />
            <Route path={ROUTES.callback.path} element={<Callback />} />
            <Route path={ROUTES.home.path} element={<Home />}>
              <Route
                index
                element={<Navigate to={ROUTES.setup.path} replace />}
              />
              <Route
                path={ROUTES.setup.path}
                element={<Navigate to={ROUTES.company.path} replace />}
              />
              <Route path={ROUTES.company.path} element={<Company />} />
              <Route path={ROUTES.dashboard.path} element={<Dashboard />} />
              <Route
                path="*"
                element={<Navigate to={ROUTES.dashboard.path} replace />}
              />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
