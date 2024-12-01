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
  manage: {
    name: 'Manage',
    path: '/manage',
  },
  dashboard: {
    name: 'Dashboard',
    path: '/manage/dashboard',
  },
  company: {
    name: 'Company',
    path: '/manage/company',
  },
  branches: {
    name: 'Branches',
    path: '/manage/branches',
  },
  employees: {
    name: 'Employees',
    path: '/manage/employees',
  },
  newBranch: {
    name: 'Create Branch',
    path: '/manage/branches/new',
  },
  editBranch: {
    name: 'Edit Branch',
    path: '/manage/branches/edit/:id',
  },
};
