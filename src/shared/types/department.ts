export interface Department {
  id: number;
  name: string;
  parentDepartmentId: number | null;
  managerId: number | null;
  parentDepartmentName?: string;
  managerName?: string;
}

export type DepartmentFieldConfig = {
  [K in keyof Department]: { field: K; name: string };
};
