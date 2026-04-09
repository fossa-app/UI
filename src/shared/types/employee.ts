import type { EmployeeRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import type { BridgeViewModel } from './common';

type BridgeEmployee = BridgeViewModel<EmployeeRetrievalModel>;

export type Employee = Omit<BridgeEmployee, 'companyId' | 'jobTitle' | 'firstName' | 'lastName' | 'fullName'> & {
  companyId?: bigint;
  jobTitle: string;
  firstName: string;
  lastName: string;
  fullName: string;
  picture?: string;
  isDraft?: boolean;
  assignedBranchName?: string;
  assignedDepartmentName?: string;
  reportsToName?: string;
};

export type DraftEmployee = Omit<Employee, 'id' | 'isDraft'> & {
  isDraft: true;
};

export type Profile = Employee | DraftEmployee;

export type EmployeeFieldConfig = {
  [K in keyof Employee]: { field: K; name: string };
};
