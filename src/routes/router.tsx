import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RootPage from 'pages/Root';
import NotFoundPage from 'pages/NotFound';
import LoginPage from 'pages/Login';
import ProtectedPage from 'pages/Protected';
import CallbackPage from 'pages/Callback';
import SetupPage from 'pages/Setup/Setup';
import CompanySetupPage from 'pages/Setup/CompanySetup';
import BranchesSetupPage from 'pages/Setup/BranchesSetup';
import EmployeeSetupPage from 'pages/Setup/EmployeeSetup';
import ManagePage from 'pages/Manage/Manage';
import DashboardPage from 'pages/Dashboard';
import CompanyPage from 'pages/Company';
import BranchesPage from 'pages/Branches';

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
            index: true,
            element: <Navigate to={ROUTES.manage.path} replace />,
          },
          {
            path: ROUTES.setup.path,
            element: <SetupPage />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.setCompany.path} replace />,
              },
              {
                path: ROUTES.setCompany.path,
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
          {
            path: ROUTES.manage.path,
            element: <ManagePage />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.dashboard.path} replace />,
              },
              {
                path: ROUTES.dashboard.path,
                element: <DashboardPage />,
              },
              {
                path: ROUTES.company.path,
                element: <CompanyPage />,
              },
              {
                path: ROUTES.branches.path,
                element: <BranchesPage />,
              },
              {
                path: '*',
                element: <Navigate to={ROUTES.dashboard.path} replace />,
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
