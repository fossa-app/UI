import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RootPage from 'pages/Root';
import LoginPage from 'pages/Login';
import ProtectedPage from 'pages/Protected';
import DashboardPage from 'pages/Dashboard';
import CallbackPage from 'pages/Callback';
import SetupPage from 'pages/Setup/Setup';
import CompanySetupPage from 'pages/Setup/CompanySetup';
import BranchesSetupPage from 'pages/Setup/BranchesSetup';
import EmployeeSetupPage from 'pages/Setup/EmployeeSetup';
import CompanyPage from 'pages/Company';
import BranchesPage from 'pages/Branches';
import NotFoundPage from 'pages/NotFound';

const router = createBrowserRouter([
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
        path: '/',
        element: <ProtectedPage />,
        children: [
          {
            path: ROUTES.setup.path,
            element: <SetupPage />,
            children: [
              {
                path: ROUTES.setCompany.path,
                index: true,
                element: <CompanySetupPage />,
              },
              {
                path: ROUTES.setBranches.path,
                element: <BranchesSetupPage />,
              },
              {
                path: ROUTES.setEmployee.path,
                element: <EmployeeSetupPage />,
              },
            ],
          },
          { path: ROUTES.dashboard.path, element: <DashboardPage /> },
          { path: ROUTES.company.path, element: <CompanyPage /> },
          { path: ROUTES.branches.path, element: <BranchesPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
