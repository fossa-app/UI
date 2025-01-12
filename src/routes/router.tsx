import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RootPage from 'pages/Root';
import ProtectedPage from 'pages/Protected';
import SetupPage from 'pages/Setup/Setup';
import ManagePage from 'pages/Manage/Manage';
import { createLazyComponent } from './lazy-loaded-component';

// Lazy loaded pages
const LoginPage = createLazyComponent(() => import('pages/Login'), { title: ROUTES.login.name });
const CallbackPage = createLazyComponent(() => import('pages/Callback'), { title: ROUTES.callback.name });
const SetupCompanyPage = createLazyComponent(() => import('pages/Setup/pages/SetupCompany'), { title: ROUTES.setCompany.name });
const SetupBranchPage = createLazyComponent(() => import('pages/Setup/pages/SetupBranch'), { title: ROUTES.setBranch.name });
const SetupEmployeePage = createLazyComponent(() => import('pages/Setup/pages/SetupEmployee'), { title: ROUTES.setEmployee.name });
const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), { title: 'Not found' });
const DashboardPage = createLazyComponent(() => import('pages/Dashboard'), { title: ROUTES.dashboard.name });
const CompanyPage = createLazyComponent(() => import('pages/Manage/Company/Company'));
const EditCompanyPage = createLazyComponent(() => import('pages/Manage/Company/pages/EditCompany'), {
  title: ROUTES.editCompany.name,
  isAdminRoute: true,
});
const ViewCompanyPage = createLazyComponent(() => import('pages/Manage/Company/pages/ViewCompany'), { title: ROUTES.viewCompany.name });
const EmployeePage = createLazyComponent(() => import('pages/Manage/Employee/Employee'));
const EmployeeTablePage = createLazyComponent(() => import('pages/Manage/Employee/pages/EmployeeTable'), { title: ROUTES.employees.name });
const BranchPage = createLazyComponent(() => import('pages/Manage/Branch/Branch'));
const BranchTablePage = createLazyComponent(() => import('pages/Manage/Branch/pages/BranchTable'), { title: ROUTES.branches.name });
const ViewBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ViewBranch'), { title: ROUTES.viewBranch.name });
const CreateBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ManageBranch'), {
  title: ROUTES.newBranch.name,
  isAdminRoute: true,
});
const EditBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ManageBranch'), {
  title: ROUTES.editBranch.name,
  isAdminRoute: true,
});

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootPage />,
      children: [
        {
          path: ROUTES.login.path,
          element: LoginPage,
        },
        {
          path: ROUTES.callback.path,
          element: CallbackPage,
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
                  element: SetupCompanyPage,
                },
                {
                  path: ROUTES.setBranch.path,
                  element: SetupBranchPage,
                },
                {
                  path: ROUTES.setEmployee.path,
                  element: SetupEmployeePage,
                },
              ],
            },
            {
              path: ROUTES.manage.path,
              element: <ManagePage />,
              children: [
                {
                  index: true,
                  element: <Navigate to={ROUTES.company.path} replace />,
                },
                {
                  path: ROUTES.dashboard.path,
                  element: DashboardPage,
                },
                {
                  path: ROUTES.company.path,
                  element: CompanyPage,
                  children: [
                    {
                      index: true,
                      element: <Navigate to={ROUTES.viewCompany.path} replace />,
                    },
                    {
                      path: ROUTES.viewCompany.path,
                      element: ViewCompanyPage,
                    },
                    {
                      path: ROUTES.editCompany.path,
                      element: EditCompanyPage,
                    },
                  ],
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
                    {
                      path: ROUTES.viewBranch.path,
                      element: ViewBranchPage,
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
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
