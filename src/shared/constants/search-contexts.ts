/* eslint-disable no-unused-vars */
export enum SearchContext {
  COMPANY = 'company',
  BRANCHES = 'branches',
  EMPLOYEE = 'employee',
}

export const SEARCH_CONTEXTS = new Map<SearchContext, string>([
  [SearchContext.COMPANY, 'manage/company'],
  [SearchContext.BRANCHES, 'manage/branches'],
  [SearchContext.EMPLOYEE, 'manage/employee'],
]);
