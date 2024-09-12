/* eslint-disable no-unused-vars */
export enum RouteKey {
  login = 'login',
  home = 'home',
  dashboard = 'dashboard',
}

export interface RouteItem {
  name: string;
  path: string;
}

export type AppRoute = { [key in RouteKey]: RouteItem };
