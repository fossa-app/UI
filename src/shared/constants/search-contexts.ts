/* eslint-disable no-unused-vars */
export enum SearchContext {
  BRANCHES = 'branches',
  EMPLOYEES = 'employees',
}

export const SEARCH_CONTEXTS = new Map<string, SearchContext>([
  ['/manage/branches', SearchContext.BRANCHES],
  ['/manage/employees', SearchContext.EMPLOYEES],
]);
