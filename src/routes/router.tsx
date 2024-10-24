import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RootPage from 'pages/Root';
import RouteTitle from 'components/RouteTitle';
import NotFoundPage from 'pages/NotFound';
import LoginPage from 'pages/Login';
import ProtectedPage from 'pages/Protected';
import CallbackPage from 'pages/Callback';
import SetupPage from 'pages/Setup/Setup';
import CompanySetupPage from 'pages/Setup/CompanySetup';
import BranchSetupPage from 'pages/Setup/BranchSetup';
import EmployeeSetupPage from 'pages/Setup/EmployeeSetup';
import ManagePage from 'pages/Manage/Manage';
import DashboardPage from 'pages/Dashboard';
import CompanyPage from 'pages/Company';
import BranchesPage from 'pages/Branches';
import EmployeePage from 'pages/Manage/Employee/Employee';
import EmployeeListPage from 'pages/Manage/Employee/pages/EmployeeList';
import CreateEditEmployeePage from 'pages/Manage/Employee/pages/CreateEditEmployee';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        path: ROUTES.login.path,
        element: (
          <>
            <RouteTitle title="Login" />
            <LoginPage />
          </>
        ),
      },
      {
        path: ROUTES.callback.path,
        element: (
          <>
            <RouteTitle title="Callback" />
            <CallbackPage />
          </>
        ),
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
                element: (
                  <>
                    <RouteTitle title="Create a Company" />
                    <CompanySetupPage />
                  </>
                ),
              },
              {
                path: ROUTES.setBranches.path,
                element: (
                  <>
                    <RouteTitle title="Create a Branch" />
                    <BranchSetupPage />
                  </>
                ),
              },
              {
                path: ROUTES.setEmployee.path,
                element: (
                  <>
                    <RouteTitle title="Create an Employee" />
                    <EmployeeSetupPage />
                  </>
                ),
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
                element: (
                  <>
                    <RouteTitle title="Dashboard" />
                    <DashboardPage />
                  </>
                ),
              },
              {
                path: ROUTES.company.path,
                element: (
                  <>
                    <RouteTitle title="Company" />
                    <CompanyPage />
                  </>
                ),
              },
              {
                path: ROUTES.branches.path,
                element: (
                  <>
                    <RouteTitle title="Branches" />
                    <BranchesPage />
                  </>
                ),
              },
              {
                path: ROUTES.employees.path,
                element: <EmployeePage />,
                children: [
                  {
                    index: true,
                    element: (
                      <>
                        <RouteTitle title="Employee List" />
                        <EmployeeListPage />
                      </>
                    ),
                  },
                  {
                    path: ROUTES.newEmployee.path,
                    element: (
                      <>
                        <RouteTitle title="Create/Edit Employee" />
                        <CreateEditEmployeePage />
                      </>
                    ),
                  },
                ],
              },
              {
                path: '*',
                element: <Navigate to={ROUTES.dashboard.path} replace />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: (
          <>
            <RouteTitle title="Page not found" />
            <NotFoundPage />
          </>
        ),
      },
    ],
  },
]);

export default router;
