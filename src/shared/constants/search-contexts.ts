import { ROUTES } from './routes';

export enum SearchContext {
  BRANCHES = 'branches',
  EMPLOYEES = 'employees',
}

export const SEARCH_CONTEXTS = new Map<string, SearchContext>([
  [ROUTES.branches.path, SearchContext.BRANCHES],
  [ROUTES.employees.path, SearchContext.EMPLOYEES],
]);
