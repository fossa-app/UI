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
  company: {
    name: 'Company',
    path: '/manage/company',
  },
  editCompany: {
    name: 'Edit Company',
    path: '/manage/company/edit',
  },
  viewCompany: {
    name: 'View Company',
    path: '/manage/company/view',
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
  viewBranch: {
    name: 'View Branch',
    path: '/manage/branches/view/:id',
  },
  profile: {
    name: 'Profile',
    path: '/manage/profile',
  },
  viewProfile: {
    name: 'View Profile',
    path: '/manage/profile/view',
  },
  editProfile: {
    name: 'Edit Profile',
    path: '/manage/profile/edit',
  },
  viewEmployee: {
    name: 'View Employee',
    path: '/manage/employees/view/:id',
  },
  editEmployee: {
    name: 'Edit Employee',
    path: '/manage/employees/edit/:id',
  },
};
