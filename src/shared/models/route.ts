/* eslint-disable no-unused-vars */
export enum RouteKey {
  login = 'login',
  callback = 'callback',
  setup = 'setup',
  setCompany = 'setCompany',
  setBranches = 'setBranches',
  setEmployee = 'setEmployee',
  dashboard = 'dashboard',
  company = 'company',
  branches = 'branches',
}

export interface RouteItem {
  name: string;
  path: string;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
