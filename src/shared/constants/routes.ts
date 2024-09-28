import { AppRoute } from 'shared/models';

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
    path: '/setup/company',
  },
  branches: {
    name: 'Branches',
    path: '/setup/branches',
  },
  employee: {
    name: 'Employee',
    path: '/setup/employee',
  },
  dashboard: {
    name: 'Dashboard',
    path: '/dashboard',
  },
};
