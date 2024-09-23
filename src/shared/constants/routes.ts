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
  dashboard: {
    name: 'Dashboard',
    path: '/dashboard',
  },
};
