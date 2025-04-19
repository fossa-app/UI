import { AppRoute, SetupStep } from 'shared/models';

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
  setup: {
    name: 'Setup',
    path: '/setup',
  },
  setCompany: {
    name: 'Set Company',
    path: `/setup/${SetupStep.COMPANY}`,
  },
  setBranch: {
    name: 'Set Branch',
    path: `/setup/${SetupStep.BRANCH}`,
  },
  setEmployee: {
    name: 'Set Employee',
    path: `/setup/${SetupStep.EMPLOYEE}`,
  },
  flows: {
    name: 'Flows',
    path: '/flows',
  },
  company: {
    name: 'Company',
    path: '/flows/company',
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
  employees: {
    name: 'Employees',
    path: '/flows/employees',
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
  viewProfile: {
    name: 'View Profile',
    path: '/flows/profile/view',
  },
  editProfile: {
    name: 'Edit Profile',
    path: '/flows/profile/edit',
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
