import { IconType, SvgIcon } from './icon';

export enum RouteKey {
  login = 'login',
  callback = 'callback',
  setup = 'setup',
  setCompany = 'setCompany',
  setBranch = 'setBranch',
  setEmployee = 'setEmployee',
  flows = 'flows',
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

export interface Flow {
  name: string;
  path: string;
  disabled?: boolean;
  icon?: SvgIcon;
  subFlows?: Flow[];
}

export type FlowsMap = {
  [key in RouteKey]?: {
    name: string;
    path: string;
    icon?: IconType;
    subFlows?: {
      [subKey in RouteKey]?: {
        name: string;
        path: string;
        disabled?: boolean;
        icon?: IconType;
      };
    };
  };
};

export type AppRoute = { [key in RouteKey]: RouteItem };
