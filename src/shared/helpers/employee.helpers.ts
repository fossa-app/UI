import { AppUser, Branch, BranchDTO, Department, DepartmentDTO, Employee, EmployeeDTO } from 'shared/models';
import { mapUserProfileToEmployee } from './user.helpers';

export const mapEmployee = (employee: EmployeeDTO, user?: AppUser, branch?: Branch, department?: Department): Employee => {
  const assignedBranchName = branch?.name;
  const assignedDepartmentName = department?.name;

  return {
    ...(user ? mapUserProfileToEmployee(user.profile) : {}),
    ...employee,
    assignedBranchName,
    assignedDepartmentName,
  };
};

export const mapEmployees = (employees: EmployeeDTO[], branches: BranchDTO[] = [], departments: DepartmentDTO[] = []): Employee[] => {
  return employees.map((employee) => {
    const branch = branches.find(({ id }) => id === employee.assignedBranchId);
    const department = departments.find(({ id }) => id === employee.assignedDepartmentId);

    return mapEmployee(employee, undefined, branch, department);
  });
};

export const mapEmployeeDTO = (employee: Employee): Pick<EmployeeDTO, 'assignedBranchId' | 'assignedDepartmentId'> => {
  return {
    assignedBranchId: employee.assignedBranchId || null,
    assignedDepartmentId: employee.assignedDepartmentId || null,
  };
};

export const mapProfileDTO = (employee: Employee): EmployeeDTO => {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    fullName: employee.fullName,
    assignedBranchId: employee.assignedBranchId || null,
    assignedDepartmentId: employee.assignedDepartmentId || null,
  };
};

export const getEmployeesAssignedBranchIds = (employees: EmployeeDTO[]): number[] => {
  return employees.filter(({ assignedBranchId }) => assignedBranchId).map(({ assignedBranchId }) => assignedBranchId) as number[];
};

export const getEmployeesAssignedDepartmentIds = (employees: EmployeeDTO[]): number[] => {
  return employees
    .filter(({ assignedDepartmentId }) => assignedDepartmentId)
    .map(({ assignedDepartmentId }) => assignedDepartmentId) as number[];
};
