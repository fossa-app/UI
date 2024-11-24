/* eslint-disable no-unused-vars */

export interface Branch {
  id?: number;
  companyId?: number;
  name: string;
}

export enum BranchFormField {
  name = 'name',
  timezone = 'timezone',
}
