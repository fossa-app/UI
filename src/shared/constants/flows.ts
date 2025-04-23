import { FlowsMap, IconType, RouteKey, UserRole } from 'shared/models';
import { ROUTES } from './routes';

export const FLOWS_MAP: FlowsMap = {
  [RouteKey.company]: {
    name: ROUTES.company.name,
    path: ROUTES.company.path,
    icon: IconType.company,
    subFlows: {
      [RouteKey.companyOnboarding]: {
        name: ROUTES.companyOnboarding.name,
        path: ROUTES.companyOnboarding.path,
        icon: IconType.assign,
        roles: [UserRole.administrator],
      },
      [RouteKey.viewCompany]: {
        name: ROUTES.viewCompany.name,
        path: ROUTES.viewCompany.path,
        icon: IconType.company,
      },
      [RouteKey.companyOffboarding]: {
        name: ROUTES.companyOffboarding.name,
        path: ROUTES.companyOffboarding.path,
        icon: IconType.remove,
        roles: [UserRole.administrator],
        disabled: true,
      },
    },
  },
  [RouteKey.branches]: {
    name: ROUTES.branches.name,
    path: ROUTES.branches.path,
    icon: IconType.branch,
    subFlows: {
      [RouteKey.branches]: {
        name: ROUTES.branches.name,
        path: ROUTES.branches.path,
        icon: IconType.branch,
      },
    },
  },
  [RouteKey.employees]: {
    name: ROUTES.employees.name,
    path: ROUTES.employees.path,
    icon: IconType.employee,
    subFlows: {
      [RouteKey.employees]: {
        name: ROUTES.employees.name,
        path: ROUTES.employees.path,
        icon: IconType.employee,
      },
    },
  },
  [RouteKey.profile]: {
    name: ROUTES.profile.name,
    path: ROUTES.profile.path,
    icon: IconType.profile,
    subFlows: {
      [RouteKey.employeeOnbarding]: {
        name: ROUTES.employeeOnbarding.name,
        path: ROUTES.employeeOnbarding.path,
        icon: IconType.assign,
      },
      [RouteKey.viewProfile]: {
        name: ROUTES.viewProfile.name,
        path: ROUTES.viewProfile.path,
        icon: IconType.profile,
      },
      [RouteKey.employeeOffboarding]: {
        name: ROUTES.employeeOffboarding.name,
        path: ROUTES.employeeOffboarding.path,
        icon: IconType.remove,
        disabled: true,
      },
    },
  },
};
