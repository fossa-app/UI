import { AppUser, Branch, Employee, EmployeeDTO } from 'shared/models';
import { mapUserProfileToEmployee } from './user.helpers';
import { FieldProps, SelectOption } from 'components/UI/Form';
import { EMPLOYEE_FIELDS } from 'shared/constants';

export const mapEmployee = (employee: EmployeeDTO, user?: AppUser, branches?: Branch[]): Employee => {
  const assignedBranchName = branches?.find(({ id }) => id === employee.assignedBranchId)?.name;

  return {
    ...(user ? mapUserProfileToEmployee(user.profile) : {}),
    ...employee,
    assignedBranchName,
  };
};

export const mapEmployees = (employees: EmployeeDTO[], branches?: Branch[]): Employee[] => {
  return employees.map((employee) => mapEmployee(employee, undefined, branches));
};

export const mapEmployeeDTO = (employee: Employee): Pick<EmployeeDTO, 'assignedBranchId'> => {
  return {
    assignedBranchId: employee.assignedBranchId || null,
  };
};

export const mapEmployeeBranchesToFieldSelectOptions = (fields: FieldProps<Employee>[], branches?: Branch[]): FieldProps<Employee>[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.name === EMPLOYEE_FIELDS.assignedBranchId!.field &&
      branches?.length && {
        options: branches.map(mapBranchesToFieldSelectOption),
      }),
  }));
};

export const mapBranchesToFieldSelectOption = (branch: Branch): SelectOption => {
  return {
    label: branch.name,
    value: `${branch?.id}`,
  };
};
