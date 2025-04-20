import { FlowsMap, IconType, RouteKey } from 'shared/models';
import { ROUTES } from './routes';

export const FLOWS_MAP: FlowsMap = {
  [RouteKey.company]: {
    name: ROUTES.company.name,
    path: ROUTES.company.path,
    icon: IconType.company,
    subFlows: {
      [RouteKey.setCompany]: {
        name: ROUTES.setCompany.name,
        path: ROUTES.setCompany.path,
        icon: IconType.assign,
      },
      [RouteKey.viewCompany]: {
        name: ROUTES.viewCompany.name,
        path: ROUTES.viewCompany.path,
        icon: IconType.company,
      },
    },
  },
  [RouteKey.branches]: {
    name: ROUTES.branches.name,
    path: ROUTES.branches.path,
    icon: IconType.branch,
    subFlows: {
      [RouteKey.setBranch]: {
        name: ROUTES.setBranch.name,
        path: ROUTES.setBranch.path,
        icon: IconType.assign,
      },
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
      [RouteKey.setEmployee]: {
        name: ROUTES.setEmployee.name,
        path: ROUTES.setEmployee.path,
        icon: IconType.assign,
      },
      [RouteKey.viewProfile]: {
        name: ROUTES.viewProfile.name,
        path: ROUTES.viewProfile.path,
        icon: IconType.profile,
      },
    },
  },
};
