import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RootPage from 'pages/Root';
import LoginPage from 'pages/Login';
import ProtectedPage from 'pages/Protected';
import DashboardPage from 'pages/Dashboard';
import CallbackPage from 'pages/Callback';
import SetupPage from 'pages/Setup/Setup';
import CompanyPage from 'pages/Setup/Company';
import BranchesPage from 'pages/Setup/Branches';
import EmployeePage from 'pages/Setup/Employee';

const router = createBrowserRouter([
  // TODO: add Error component
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: ROUTES.login.path,
        element: <LoginPage />,
      },
      {
        path: ROUTES.callback.path,
        element: <CallbackPage />,
      },
      {
        path: ROUTES.home.path,
        element: <ProtectedPage />,
        children: [
          { index: true, element: <Navigate to={ROUTES.setup.path} replace /> },
          {
            path: ROUTES.setup.path,
            element: <SetupPage />,
            children: [
              {
                path: ROUTES.company.path,
                index: true,
                element: <CompanyPage />,
              },
              {
                path: ROUTES.branches.path,
                element: <BranchesPage />,
              },
              {
                path: ROUTES.employee.path,
                element: <EmployeePage />,
              },
            ],
          },
          { path: ROUTES.dashboard.path, element: <DashboardPage /> },
          { path: '*', element: <Navigate to={ROUTES.dashboard.path} replace /> },
        ],
      },
    ],
  },
]);

export default router;
