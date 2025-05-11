import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RouteTitle from 'components/RouteTitle';
import RootPage from 'pages/Root';
import ProtectedPage from 'pages/Protected';
import ManagePage from 'pages/Manage/Manage';
import FlowsPage from 'pages/Manage/Flows';
// TODO: lazy load the OnboardingPage
import OnboardingPage from 'pages/Manage/Onboarding/Onboarding';
import CompanyOnboarding from 'pages/Manage/Onboarding/pages/Company/CompanyOnboarding';
import EmployeeOnboarding from 'pages/Manage/Onboarding/pages/Employee/EmployeeOnboarding';
import { createLazyComponent } from './lazy-loaded-component';

// Lazy loaded pages
const LoginPage = createLazyComponent(() => import('pages/Login'), { title: ROUTES.login.name });
const CallbackPage = createLazyComponent(() => import('pages/Callback'), { title: ROUTES.callback.name });
const SetupCompanyPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/SetupCompany'), {
  title: ROUTES.companyOnboarding.name,
});
const SetupBranchPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/SetupBranch'), {
  title: ROUTES.setupBranch.name,
});
const SetupEmployeePage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Employee/SetupEmployee'), {
  title: ROUTES.employeeOnbarding.name,
});
const NotFoundPage = createLazyComponent(() => import('pages/NotFound'), { title: 'Not found' });
const CompanyPage = createLazyComponent(() => import('pages/Manage/Company/Company'));
const EditCompanyPage = createLazyComponent(() => import('pages/Manage/Company/pages/EditCompany'), {
  title: ROUTES.editCompany.name,
  isAdminRoute: true,
});
const ViewCompanyPage = createLazyComponent(() => import('pages/Manage/Company/pages/ViewCompany'), { title: ROUTES.viewCompany.name });
const EmployeePage = createLazyComponent(() => import('pages/Manage/Employee/Employee'));
const EmployeeCatalogPage = createLazyComponent(() => import('pages/Manage/Employee/pages/EmployeeCatalog'), {
  title: ROUTES.employees.name,
});
const EditEmployeePage = createLazyComponent(() => import('pages/Manage/Employee/pages/EditEmployee'), {
  title: ROUTES.editEmployee.name,
  isAdminRoute: true,
});
const ViewEmployeePage = createLazyComponent(() => import('pages/Manage/Employee/pages/ViewEmployee'), { title: ROUTES.viewEmployee.name });
const BranchPage = createLazyComponent(() => import('pages/Manage/Branch/Branch'));
const BranchCatalogPage = createLazyComponent(() => import('pages/Manage/Branch/pages/BranchCatalog'), { title: ROUTES.branches.name });
const ViewBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ViewBranch'), { title: ROUTES.viewBranch.name });
const CreateBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ManageBranch'), {
  title: ROUTES.newBranch.name,
  isAdminRoute: true,
});
const EditBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ManageBranch'), {
  title: ROUTES.editBranch.name,
  isAdminRoute: true,
});
const ProfilePage = createLazyComponent(() => import('pages/Manage/Profile/Profile'), { title: ROUTES.profile.name });
const EditProfilePage = createLazyComponent(() => import('pages/Manage/Profile/pages/EditProfile'), { title: ROUTES.editProfile.name });
const ViewProfilePage = createLazyComponent(() => import('pages/Manage/Profile/pages/ViewProfile'), { title: ROUTES.viewProfile.name });
const DepartmentPage = createLazyComponent(() => import('pages/Manage/Department/Department'));
const DepartmentCatalogPage = createLazyComponent(() => import('pages/Manage/Department/pages/DepartmentCatalog'), {
  title: ROUTES.departments.name,
});
const ViewDepartmentPage = createLazyComponent(() => import('pages/Manage/Department/pages/ViewDepartment'), {
  title: ROUTES.viewDepartment.name,
});
const CreateDepartmentPage = createLazyComponent(() => import('pages/Manage/Department/pages/ManageDepartment'), {
  title: ROUTES.newDepartment.name,
  isAdminRoute: true,
});
const EditDepartmentPage = createLazyComponent(() => import('pages/Manage/Department/pages/ManageDepartment'), {
  title: ROUTES.editDepartment.name,
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
              element: <Navigate to={ROUTES.flows.path} replace />,
            },
            {
              path: ROUTES.flows.path,
              element: <ManagePage />,
              children: [
                {
                  index: true,
                  element: (
                    <>
                      <RouteTitle title={ROUTES.flows.name} />
                      <FlowsPage />
                    </>
                  ),
                },
                {
                  path: ROUTES.onboarding.path,
                  element: <OnboardingPage />,
                  children: [
                    {
                      index: true,
                      element: <Navigate to={ROUTES.companyOnboarding.path} replace />,
                    },
                    {
                      path: ROUTES.companyOnboarding.path,
                      element: <CompanyOnboarding />,
                      children: [
                        {
                          index: true,
                          element: <Navigate to={ROUTES.setupCompany.path} replace />,
                        },
                        {
                          path: ROUTES.setupCompany.path,
                          element: SetupCompanyPage,
                        },
                        {
                          path: ROUTES.setupBranch.path,
                          element: SetupBranchPage,
                        },
                      ],
                    },
                    {
                      path: ROUTES.employeeOnbarding.path,
                      element: <EmployeeOnboarding />,
                      children: [
                        {
                          path: ROUTES.setupEmployee.path,
                          element: SetupEmployeePage,
                        },
                      ],
                    },
                    {
                      path: '*',
                      element: <Navigate to={ROUTES.flows.path} replace />,
                    },
                  ],
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
                      element: BranchCatalogPage,
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
                      element: EmployeeCatalogPage,
                    },
                    {
                      path: ROUTES.editEmployee.path,
                      element: EditEmployeePage,
                    },
                    {
                      path: ROUTES.viewEmployee.path,
                      element: ViewEmployeePage,
                    },
                  ],
                },
                {
                  path: ROUTES.profile.path,
                  element: ProfilePage,
                  children: [
                    {
                      index: true,
                      element: <Navigate to={ROUTES.viewProfile.path} replace />,
                    },
                    {
                      path: ROUTES.viewProfile.path,
                      element: ViewProfilePage,
                    },
                    {
                      path: ROUTES.editProfile.path,
                      element: EditProfilePage,
                    },
                  ],
                },
                {
                  path: ROUTES.departments.path,
                  element: DepartmentPage,
                  children: [
                    {
                      index: true,
                      element: DepartmentCatalogPage,
                    },
                    {
                      path: ROUTES.newDepartment.path,
                      element: CreateDepartmentPage,
                    },
                    {
                      path: ROUTES.editDepartment.path,
                      element: EditDepartmentPage,
                    },
                    {
                      path: ROUTES.viewDepartment.path,
                      element: ViewDepartmentPage,
                    },
                  ],
                },
                {
                  path: '*',
                  element: <Navigate to={ROUTES.company.path} replace />,
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
