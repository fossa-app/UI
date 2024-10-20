/* eslint-disable no-unused-vars */
export enum RouteKey {
  login = 'login',
  callback = 'callback',
  setup = 'setup',
  setCompany = 'setCompany',
  setBranches = 'setBranches',
  setEmployee = 'setEmployee',
  manage = 'manage',
  dashboard = 'dashboard',
  company = 'company',
  branches = 'branches',
  employees = 'employees',
}

export interface RouteItem {
  name: string;
  path: string;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
