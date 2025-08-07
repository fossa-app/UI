export interface EmployeeDTO {
  id?: number;
  companyId?: number;
  assignedBranchId: number | null;
  assignedDepartmentId: number | null;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface Employee extends EmployeeDTO {
  picture?: string;
  isDraft?: boolean;
  assignedBranchName?: string;
  assignedDepartmentName?: string;
}

export type EmployeeFieldConfig = {
  [K in keyof Employee]: { field: K; name: string };
};
