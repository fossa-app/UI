import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

/* eslint-disable no-unused-vars */
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
  branches = 'branches',
  employees = 'employees',
  newBranch = 'newBranch',
  editBranch = 'editBranch',
  viewBranch = 'viewBranch',
}

export interface RouteItem {
  name: string;
  path: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
