/* eslint-disable no-unused-vars */

export interface Employee {
  id?: number;
  companyId?: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export enum EmployeeFormField {
  firstName = 'firstName',
  lastName = 'lastName',
  fullName = 'fullName',
}
