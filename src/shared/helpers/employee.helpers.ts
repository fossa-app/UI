import { AppUser, Branch, BranchDTO, Employee, EmployeeDTO } from 'shared/models';
import { FieldOption } from 'components/UI/Form';
import { mapUserProfileToEmployee } from './user.helpers';

export const mapEmployee = (employee: EmployeeDTO, user?: AppUser, branch?: Branch): Employee => {
  const assignedBranchName = branch?.name;

  return {
    ...(user ? mapUserProfileToEmployee(user.profile) : {}),
    ...employee,
    assignedBranchName,
  };
};

export const mapEmployees = (employees: EmployeeDTO[], branches: BranchDTO[] = []): Employee[] => {
  return employees.map((employee) => {
    const branch = branches.find(({ id }) => id === employee.assignedBranchId);

    return mapEmployee(employee, undefined, branch);
  });
};

export const mapEmployeeDTO = (employee: Employee): Pick<EmployeeDTO, 'assignedBranchId'> => {
  return {
    assignedBranchId: employee.assignedBranchId || null,
  };
};

export const mapProfileDTO = (employee: Employee): EmployeeDTO => {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    fullName: employee.fullName,
    assignedBranchId: employee.assignedBranchId || null,
  };
};

export const mapBranchToFieldOption = (branch: Branch): FieldOption => {
  return {
    label: branch.name,
    value: String(branch?.id),
  };
};

export const getEmployeesAssignedBranchIds = (employees: EmployeeDTO[]): number[] => {
  return employees.filter(({ assignedBranchId }) => assignedBranchId).map(({ assignedBranchId }) => assignedBranchId) as number[];
};
