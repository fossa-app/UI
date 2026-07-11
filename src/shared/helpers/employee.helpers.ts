import { AppUser, Branch, Department, Employee, EntityInput } from 'shared/types';
import type { EmployeeRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { FieldOption } from 'components/UI/Form';
import { toBigIntId, toNullableBigIntId } from './data.helpers';
import { mapUserProfileToEmployeeDetails } from './user.helpers';

export const mapEmployeeRetrievalModel = (employee: EmployeeRetrievalModel): Employee => ({
  ...employee,
  id: toBigIntId(employee.id),
  companyId: toBigIntId(employee.companyId),
  assignedBranchId: toNullableBigIntId(employee.assignedBranchId),
  assignedDepartmentId: toNullableBigIntId(employee.assignedDepartmentId),
  reportsToId: toNullableBigIntId(employee.reportsToId),
  jobTitle: employee.jobTitle ?? '',
  firstName: employee.firstName ?? '',
  lastName: employee.lastName ?? '',
  fullName: employee.fullName ?? '',
});

export const mapEmployee = ({
  employee,
  user,
  branch,
  department,
  manager,
}: {
  employee: Employee;
  user?: AppUser;
  branch?: Branch;
  department?: Department;
  manager?: Employee;
}): Employee => {
  const assignedBranchName = branch?.name;
  const assignedDepartmentName = department?.name;
  const reportsToName = manager?.fullName;

  return {
    ...(user ? mapUserProfileToEmployeeDetails(user.profile) : {}),
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
  employees: Employee[];
  branches?: Branch[];
  departments?: Department[];
  managers?: Employee[];
}): Employee[] => {
  return employees.map((employee) => {
    const branch = employee.assignedBranchId ? branches.find(({ id }) => id === employee.assignedBranchId) : undefined;
    const department = employee.assignedDepartmentId ? departments.find(({ id }) => id === employee.assignedDepartmentId) : undefined;
    const manager = employee.reportsToId ? managers.find(({ id }) => id === employee.reportsToId) : undefined;

    return mapEmployee({ employee, branch, department, manager });
  });
};

export const mapEmployeeInput = (employee: Employee): Omit<EntityInput<Employee>, 'firstName' | 'lastName' | 'fullName'> => {
  return {
    jobTitle: employee.jobTitle,
    assignedBranchId: employee.assignedBranchId || null,
    assignedDepartmentId: employee.assignedDepartmentId || null,
    reportsToId: employee.reportsToId || null,
  };
};

export const mapProfileInput = (employee: EntityInput<Employee>): EntityInput<Employee> => {
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

export const mapEmployeeToFieldOption = (employee: Pick<Employee, 'id' | 'fullName'>): FieldOption => {
  return {
    label: employee.fullName,
    value: String(employee.id),
  };
};
