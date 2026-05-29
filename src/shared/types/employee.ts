export interface Employee {
  id: number;
  companyId?: number;
  assignedBranchId: number | null;
  assignedDepartmentId: number | null;
  reportsToId: number | null;
  jobTitle: string;
  firstName: string;
  lastName: string;
  fullName: string;
  picture?: string;
  isDraft?: boolean;
  assignedBranchName?: string;
  assignedDepartmentName?: string;
  reportsToName?: string;
}

export type EmployeeFieldConfig = {
  [K in keyof Employee]: { field: K; name: string };
};
