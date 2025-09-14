import { IconType, SvgIcon } from './icon';
import { UserRole } from './user';

export enum RouteKey {
  login = 'login',
  callback = 'callback',
  onboarding = 'onboarding',
  offboarding = 'offboarding',
  companyOnboarding = 'companyOnboarding',
  companyOffboarding = 'companyOffboarding',
  createCompany = 'createCompany',
  employeeOnboarding = 'employeeOnboarding',
  employeeOffboarding = 'employeeOffboarding',
  flows = 'flows',
  company = 'company',
  editCompany = 'editCompany',
  viewCompany = 'viewCompany',
  deleteCompany = 'deleteCompany',
  companySettings = 'companySettings',
  createCompanySettings = 'createCompanySettings',
  uploadCompanyLicense = 'uploadCompanyLicense',
  branches = 'branches',
  employees = 'employees',
  createBranch = 'createBranch',
  newBranch = 'newBranch',
  editBranch = 'editBranch',
  viewBranch = 'viewBranch',
  profile = 'profile',
  createEmployee = 'createEmployee',
  viewProfile = 'viewProfile',
  editProfile = 'editProfile',
  editEmployee = 'editEmployee',
  viewEmployee = 'viewEmployee',
  deleteEmployee = 'deleteEmployee',
  employeeOrgChart = 'employeeOrgChart',
  departments = 'departments',
  newDepartment = 'newDepartment',
  editDepartment = 'editDepartment',
  viewDepartment = 'viewDepartment',
  deleteCompanySettings = 'deleteCompanySettings',
  companyOffboardingInstructions = 'companyOffboardingInstructions',
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
