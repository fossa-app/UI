import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import RouteTitle from 'components/RouteTitle';
import RootPage from 'pages/Root';
import ProtectedPage from 'pages/Protected';
import ManagePage from 'pages/Manage/Manage';
import FlowsPage from 'pages/Manage/Flows';
import { createLazyComponent } from './lazy-loaded-component';

// Lazy loaded pages
const LoginPage = createLazyComponent(() => import('pages/Login'), { title: ROUTES.login.name });
const CallbackPage = createLazyComponent(() => import('pages/Callback'), { title: ROUTES.callback.name });
const OnboardingPage = createLazyComponent(() => import('pages/Manage/Onboarding/Onboarding'), {
  title: ROUTES.onboarding.name,
});
const OffboardingPage = createLazyComponent(() => import('pages/Manage/Offboarding/Offboarding'), {
  title: ROUTES.offboarding.name,
});
const CompanyOnboardingPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/CompanyOnboarding'), {
  title: ROUTES.companyOnboarding.name,
});
const CompanyOffboardingPage = createLazyComponent(() => import('pages/Manage/Offboarding/pages/Company/CompanyOffboarding'), {
  title: ROUTES.companyOffboarding.name,
});
const EmployeeOnboardingPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Employee/EmployeeOnboarding'), {
  title: ROUTES.employeeOnboarding.name,
});
const EmployeeOffboardingPage = createLazyComponent(() => import('pages/Manage/Offboarding/pages/Employee/EmployeeOffboarding'), {
  title: ROUTES.employeeOffboarding.name,
});
const CreateCompanyPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/CreateCompany'), {
  title: ROUTES.createCompany.name,
});
const DeleteCompanyPage = createLazyComponent(() => import('pages/Manage/Offboarding/pages/Company/DeleteCompany'), {
  title: ROUTES.deleteCompany.name,
});
const DeleteCompanySettingsPage = createLazyComponent(() => import('pages/Manage/Offboarding/pages/Company/DeleteCompanySettings'), {
  title: ROUTES.deleteCompanySettings.name,
});
const CompanyOffboardingInstructionsPage = createLazyComponent(
  () => import('pages/Manage/Offboarding/pages/Company/CompanyOffboardingInstructions'),
  {
    title: ROUTES.companyOffboardingInstructions.name,
  }
);
const CreateBranchPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/CreateBranch'), {
  title: ROUTES.createBranch.name,
});
const UploadCompanyLicensePage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/UploadCompanyLicense'), {
  title: ROUTES.uploadCompanyLicense.name,
});
const CreateEmployeePage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Employee/CreateEmployee'), {
  title: ROUTES.createEmployee.name,
});
const DeleteEmployeePage = createLazyComponent(() => import('pages/Manage/Offboarding/pages/Employee/DeleteEmployee'), {
  title: ROUTES.deleteEmployee.name,
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
const NewBranchPage = createLazyComponent(() => import('pages/Manage/Branch/pages/ManageBranch'), {
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
const CompanySettingsPage = createLazyComponent(() => import('pages/Manage/Company/pages/CompanySettings'), {
  title: ROUTES.companySettings.name,
  isAdminRoute: true,
});
const CreateCompanySettingsPage = createLazyComponent(() => import('pages/Manage/Onboarding/pages/Company/CreateCompanySettings'), {
  title: ROUTES.createCompanySettings.name,
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
                  element: OnboardingPage,
                  children: [
                    {
                      index: true,
                      element: <Navigate to={ROUTES.companyOnboarding.path} replace />,
                    },
                    {
                      path: ROUTES.companyOnboarding.path,
                      element: CompanyOnboardingPage,
                      children: [
                        {
                          index: true,
                          element: <Navigate to={ROUTES.createCompany.path} replace />,
                        },
                        {
                          path: ROUTES.createCompany.path,
                          element: CreateCompanyPage,
                        },
                        {
                          path: ROUTES.createCompanySettings.path,
                          element: CreateCompanySettingsPage,
                        },
                        {
                          path: ROUTES.uploadCompanyLicense.path,
                          element: UploadCompanyLicensePage,
                        },
                        {
                          path: ROUTES.createBranch.path,
                          element: CreateBranchPage,
                        },
                      ],
                    },
                    {
                      path: ROUTES.employeeOnboarding.path,
                      element: EmployeeOnboardingPage,
                      children: [
                        {
                          index: true,
                          element: <Navigate to={ROUTES.createEmployee.path} replace />,
                        },
                        {
                          path: ROUTES.createEmployee.path,
                          element: CreateEmployeePage,
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
                  path: ROUTES.offboarding.path,
                  element: OffboardingPage,
                  children: [
                    {
                      index: true,
                      element: <Navigate to={ROUTES.companyOffboarding.path} replace />,
                    },
                    {
                      path: ROUTES.companyOffboarding.path,
                      element: CompanyOffboardingPage,
                      children: [
                        {
                          index: true,
                          element: <Navigate to={ROUTES.deleteCompanySettings.path} replace />,
                        },
                        {
                          path: ROUTES.deleteCompanySettings.path,
                          element: DeleteCompanySettingsPage,
                        },
                        {
                          path: ROUTES.companyOffboardingInstructions.path,
                          element: CompanyOffboardingInstructionsPage,
                        },
                        {
                          path: ROUTES.deleteCompany.path,
                          element: DeleteCompanyPage,
                        },
                      ],
                    },
                    {
                      path: ROUTES.employeeOffboarding.path,
                      element: EmployeeOffboardingPage,
                      children: [
                        {
                          index: true,
                          element: <Navigate to={ROUTES.deleteEmployee.path} replace />,
                        },
                        {
                          path: ROUTES.deleteEmployee.path,
                          element: DeleteEmployeePage,
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
                    {
                      path: ROUTES.companySettings.path,
                      element: CompanySettingsPage,
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
                      element: NewBranchPage,
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
