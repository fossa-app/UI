import { SvgIcon } from './icon';

export enum RouteKey {
  login = 'login',
  callback = 'callback',
  setup = 'setup',
  setCompany = 'setCompany',
  setBranch = 'setBranch',
  setEmployee = 'setEmployee',
  manage = 'manage',
  company = 'company',
  editCompany = 'editCompany',
  viewCompany = 'viewCompany',
  branches = 'branches',
  employees = 'employees',
  newBranch = 'newBranch',
  editBranch = 'editBranch',
  viewBranch = 'viewBranch',
  profile = 'profile',
  viewProfile = 'viewProfile',
  editProfile = 'editProfile',
  editEmployee = 'editEmployee',
  viewEmployee = 'viewEmployee',
}

export interface RouteItem {
  name: string;
  path: string;
  icon?: SvgIcon;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
