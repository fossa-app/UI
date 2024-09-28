/* eslint-disable no-unused-vars */
export enum RouteKey {
  login = 'login',
  callback = 'callback',
  home = 'home',
  setup = 'setup',
  company = 'company',
  branches = 'branches',
  employee = 'employee',
  dashboard = 'dashboard',
}

export interface RouteItem {
  name: string;
  path: string;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
