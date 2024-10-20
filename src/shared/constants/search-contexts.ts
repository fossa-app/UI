/* eslint-disable no-unused-vars */
export enum SearchContext {
  // COMPANY = 'company',
  BRANCHES = 'branches',
  EMPLOYEES = 'employees',
}

export const SEARCH_CONTEXTS = new Map<string, SearchContext>([
  // ['/manage/company', SearchContext.COMPANY], // TODO: double check this
  ['/manage/branches', SearchContext.BRANCHES],
  ['/manage/employees', SearchContext.EMPLOYEES],
]);
