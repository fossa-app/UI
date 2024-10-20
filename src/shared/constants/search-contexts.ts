/* eslint-disable no-unused-vars */
export enum SearchContext {
  COMPANY = 'company',
  BRANCHES = 'branches',
  EMPLOYEE = 'employee',
}

export const SEARCH_CONTEXTS = new Map<string, SearchContext>([
  ['/manage/company', SearchContext.COMPANY],
  ['/manage/branches', SearchContext.BRANCHES],
  ['/manage/employee', SearchContext.EMPLOYEE],
]);
