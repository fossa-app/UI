import { IconType, SvgIcon } from './icon';
import { UserRole } from './user';

export enum RouteKey {
  login = 'login',
  callback = 'callback',
  setup = 'setup',
  companyOnboarding = 'companyOnboarding',
  companyOffboarding = 'companyOffboarding',
  setBranch = 'setBranch',
  employeeOnbarding = 'employeeOnbarding',
  employeeOffboarding = 'employeeOffboarding',
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
  roles?: UserRole[];
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
        roles?: UserRole[];
      };
    };
  };
};

export type AppRoute = { [key in RouteKey]: RouteItem };
