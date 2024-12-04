/* eslint-disable no-unused-vars */

export interface Employee {
  id?: number;
  companyId?: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface EmployeeDTO extends Employee {}

export type EmployeeFieldConfig = {
  [K in keyof EmployeeDTO]: { field: K; name: string };
};
