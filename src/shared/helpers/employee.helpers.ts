import { AppUser, Branch, BranchDTO, Department, DepartmentDTO, Employee, EmployeeDTO, EntityInput } from 'shared/models';
import { FieldOption } from 'components/UI/Form';
import { mapUserProfileToEmployee } from './user.helpers';

export const mapEmployee = ({
  employee,
  user,
  branch,
  department,
  manager,
}: {
  employee: EmployeeDTO;
  user?: AppUser;
  branch?: Branch;
  department?: Department;
  manager?: Employee;
}): Employee => {
  const assignedBranchName = branch?.name;
  const assignedDepartmentName = department?.name;
  const reportsToName = manager?.fullName;

  return {
    ...(user ? mapUserProfileToEmployee(user.profile) : {}),
    ...employee,
    assignedBranchName,
    assignedDepartmentName,
    reportsToName,
  };
};

export const mapEmployees = ({
  employees,
  branches = [],
  departments = [],
  managers = [],
}: {
  employees: EmployeeDTO[];
  branches?: BranchDTO[];
  departments?: DepartmentDTO[];
  managers?: EmployeeDTO[];
}): Employee[] => {
  return employees.map((employee) => {
    const branch = branches.find(({ id }) => id === employee.assignedBranchId);
    const department = departments.find(({ id }) => id === employee.assignedDepartmentId);
    const manager = managers.find(({ id }) => id === employee.reportsToId);

    return mapEmployee({ employee, branch, department, manager });
  });
};

export const mapEmployeeDTO = (employee: Employee): Omit<EntityInput<EmployeeDTO>, 'firstName' | 'lastName' | 'fullName'> => {
  return {
    jobTitle: employee.jobTitle,
    assignedBranchId: employee.assignedBranchId || null,
    assignedDepartmentId: employee.assignedDepartmentId || null,
    reportsToId: employee.reportsToId || null,
  };
};

export const mapProfileDTO = (employee: EntityInput<Employee>): EntityInput<EmployeeDTO> => {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    fullName: employee.fullName,
    jobTitle: employee.jobTitle,
    assignedBranchId: employee.assignedBranchId || null,
    assignedDepartmentId: employee.assignedDepartmentId || null,
    reportsToId: employee.reportsToId || null,
  };
};

export const mapEmployeeToFieldOption = (employee: EmployeeDTO): FieldOption => {
  return {
    label: employee.fullName,
    value: String(employee.id),
  };
};
