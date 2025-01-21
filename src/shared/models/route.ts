import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

export enum RouteKey {
  login = 'login',
  callback = 'callback',
  setup = 'setup',
  setCompany = 'setCompany',
  setBranch = 'setBranch',
  setEmployee = 'setEmployee',
  manage = 'manage',
  dashboard = 'dashboard',
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
}

export interface RouteItem {
  name: string;
  path: string;
  icon?: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
