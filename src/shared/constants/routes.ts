import { AppRoute, SetupStep } from 'shared/models';

export const ROUTES: AppRoute = {
  login: {
    name: 'Login',
    path: '/login',
  },
  callback: {
    name: 'Callback',
    path: '/callback',
  },
  home: {
    name: 'Home',
    path: '/',
  },
  setup: {
    name: 'Setup',
    path: '/setup',
  },
  company: {
    name: 'Company',
    path: `/setup/${SetupStep.COMPANY}`,
  },
  branches: {
    name: 'Branches',
    path: `/setup/${SetupStep.BRANCHES}`,
  },
  employee: {
    name: 'Employee',
    path: `/setup/${SetupStep.EMPLOYEE}`,
  },
  dashboard: {
    name: 'Dashboard',
    path: '/dashboard',
  },
};
