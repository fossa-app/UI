import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import { ROUTES } from 'shared/constants';
import Login from 'pages/Login';
import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';

const App: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <Typography variant="h3">Fossa</Typography>
      <Routes>
        <Route path={ROUTES.login.path} element={<Login />} />
        <Route path={ROUTES.home.path} element={<Home />}>
          <Route
            path={ROUTES.home.path}
            element={<Navigate to={ROUTES.dashboard.path} replace />}
          />
          <Route path={`${ROUTES.dashboard.path}`} element={<Dashboard />} />
          <Route
            path="*"
            element={<Navigate to={ROUTES.dashboard.path} replace />}
          />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;
