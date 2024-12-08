/* eslint-disable no-unused-vars */

export interface EmployeeDTO {
  id?: number;
  companyId?: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export type EmployeeFieldConfig = {
  [K in keyof EmployeeDTO]: { field: K; name: string };
};
