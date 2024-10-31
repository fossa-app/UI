import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RootPage from 'pages/Root';
import RouteTitle from 'components/RouteTitle';
import LoginPage from 'pages/Login';
import ProtectedPage from 'pages/Protected';
import CallbackPage from 'pages/Callback';
import SetupPage from 'pages/Setup/Setup';
import CompanySetupPage from 'pages/Setup/CompanySetup';
import BranchSetupPage from 'pages/Setup/BranchSetup';
import EmployeeSetupPage from 'pages/Setup/EmployeeSetup';
import ManagePage from 'pages/Manage/Manage';
import DashboardPage from 'pages/Dashboard';
import { createLazyComponent } from './lazy-loaded-component';

// Lazy loaded pages
const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), { title: 'Not found' });
const CompanyPage = createLazyComponent(() => import('pages/Company'));
const EmployeePage = createLazyComponent(() => import('pages/Manage/Employee/Employee'));
const EmployeeTablePage = createLazyComponent(() => import('pages/Manage/Employee/pages/EmployeeTable'), { title: ROUTES.employees.name });
const BranchPage = createLazyComponent(() => import('pages/Manage/Branch/Branch'));
const BranchTablePage = createLazyComponent(() => import('pages/Manage/Branch/pages/BranchTable'), { title: ROUTES.branches.name });

const CreateBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/CreateEditBranch'), {
  title: ROUTES.newBranch.name,
  isAdminRoute: true,
});
const EditBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/CreateEditBranch'), {
  title: ROUTES.editBranch.name,
  isAdminRoute: true,
});

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
                element: CompanyPage,
              },
              {
                path: ROUTES.branches.path,
                element: BranchPage,
                children: [
                  {
                    index: true,
                    element: BranchTablePage,
                  },
                  {
                    path: ROUTES.newBranch.path,
                    element: CreateBranchPage,
                  },
                  {
                    path: ROUTES.editBranch.path,
                    element: EditBranchPage,
                  },
                ],
              },
              {
                path: ROUTES.employees.path,
                element: EmployeePage,
                children: [
                  {
                    index: true,
                    element: EmployeeTablePage,
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
        element: NotFoundPage,
      },
    ],
  },
]);

export default router;
