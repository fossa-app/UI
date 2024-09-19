import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/system/Box';
import { ROUTES } from 'shared/constants';
import Header from 'layout/Header/Header';
import Footer from 'layout/Footer/Footer';
import Login from 'pages/Login';
import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';

const App: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <Header />
      <Box display="flex" flexDirection="column" flexGrow={1} padding={2}>
        <Routes>
          <Route path={ROUTES.login.path} element={<Login />} />
          <Route path={ROUTES.home.path} element={<Home />}>
            <Route
              path={ROUTES.home.path}
              element={<Navigate to={ROUTES.dashboard.path} replace />}
            />
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
  );
};

export default App;
