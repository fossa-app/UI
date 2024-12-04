/* eslint-disable no-unused-vars */

export interface Branch {
  id?: number;
  companyId?: number;
  name: string;
}

export interface BranchDTO extends Branch {}

export type BranchFieldConfig = {
  [K in keyof BranchDTO]: { field: K; name: string };
};
