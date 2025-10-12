export interface DepartmentDTO {
  id: number;
  name: string;
  parentDepartmentId: number | null;
  managerId: number | null;
}

export interface Department extends DepartmentDTO {
  parentDepartmentName?: string;
  managerName?: string;
}

export type DepartmentFieldConfig = {
  [K in keyof Department]: { field: K; name: string };
};
