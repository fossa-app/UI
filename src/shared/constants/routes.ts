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
  setup: {
    name: 'Setup',
    path: '/setup',
  },
  setCompany: {
    name: 'Set Company',
    path: `/setup/${SetupStep.COMPANY}`,
  },
  setBranches: {
    name: 'Set Branches',
    path: `/setup/${SetupStep.BRANCHES}`,
  },
  setEmployee: {
    name: 'Set Employee',
    path: `/setup/${SetupStep.EMPLOYEE}`,
  },
  dashboard: {
    name: 'Dashboard',
    path: '/dashboard',
  },
  company: {
    name: 'Company',
    path: '/company',
  },
  branches: {
    name: 'Branches',
    path: '/branches',
  },
};
