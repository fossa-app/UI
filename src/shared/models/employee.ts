export interface EmployeeDTO {
  id?: number;
  companyId?: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface Employee extends EmployeeDTO {
  picture?: string;
  isDraft?: boolean;
}

export type EmployeeFieldConfig = {
  [K in keyof Employee]: { field: K; name: string };
};
