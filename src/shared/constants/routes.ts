import { AppRoute } from 'shared/models';

// TODO: use relative routes instead
export const ROUTES: AppRoute = {
  login: {
    name: 'Login',
    path: '/login',
  },
  callback: {
    name: 'Callback',
    path: '/callback',
  },
  flows: {
    name: 'Flows',
    path: '/flows',
  },
  setup: {
    name: 'Setup',
    path: '/flows/setup',
  },
  company: {
    name: 'Company',
    path: '/flows/company',
  },
  setCompany: {
    name: 'Company Onboarding',
    path: '/flows/setup/company',
  },
  editCompany: {
    name: 'Edit Company',
    path: '/flows/company/edit',
  },
  viewCompany: {
    name: 'View Company',
    path: '/flows/company/view',
  },
  branches: {
    name: 'Branches',
    path: '/flows/branches',
  },
  setBranch: {
    name: 'Set Branch',
    path: `/flows/setup/branch`,
  },
  newBranch: {
    name: 'Create Branch',
    path: '/flows/branches/new',
  },
  editBranch: {
    name: 'Edit Branch',
    path: '/flows/branches/edit/:id',
  },
  viewBranch: {
    name: 'View Branch',
    path: '/flows/branches/view/:id',
  },
  profile: {
    name: 'Profile',
    path: '/flows/profile',
  },
  setEmployee: {
    name: 'Employee Onboarding',
    path: '/flows/setup/employee',
  },
  // TODO: add offboardEmployee route, rename setCompany to onnboardCompany
  viewProfile: {
    name: 'View Profile',
    path: '/flows/profile/view',
  },
  editProfile: {
    name: 'Edit Profile',
    path: '/flows/profile/edit',
  },
  employees: {
    name: 'Employees',
    path: '/flows/employees',
  },
  viewEmployee: {
    name: 'View Employee',
    path: '/flows/employees/view/:id',
  },
  editEmployee: {
    name: 'Edit Employee',
    path: '/flows/employees/edit/:id',
  },
};
