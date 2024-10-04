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
import LoginPage from 'pages/Login';
import ProtectedPage from 'pages/Protected';
import DashboardPage from 'pages/Dashboard';
import CallbackPage from 'pages/Callback';
import CompanyPage from 'pages/Company';
import BranchesPage from 'pages/Branches';
import SetupPage from 'pages/Setup';
import EmployeePage from 'pages/Employee';

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
            <Route path={ROUTES.login.path} element={<LoginPage />} />
            <Route path={ROUTES.callback.path} element={<CallbackPage />} />
            <Route path={ROUTES.home.path} element={<ProtectedPage />}>
              <Route index element={<Navigate to={ROUTES.setup.path} replace />} />
              <Route path={ROUTES.setup.path} element={<SetupPage />}>
                <Route path={ROUTES.company.path} element={<CompanyPage />} />
                <Route path={ROUTES.branches.path} element={<BranchesPage />} />
                <Route path={ROUTES.employee.path} element={<EmployeePage />} />
              </Route>
              <Route path={ROUTES.dashboard.path} element={<DashboardPage />} />
              <Route path="*" element={<Navigate to={ROUTES.dashboard.path} replace />} />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
