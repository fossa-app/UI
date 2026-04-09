import { DEPARTMENT_FIELDS } from 'shared/constants';
import { Department, Employee, EntityInput } from 'shared/types';
import { FormFieldProps, FieldOption } from 'components/UI/Form';
import { mapEmployeeToFieldOption } from './employee.helpers';

export const mapDepartment = (department: Department, parentDepartment?: Department, employee?: Employee): Department => {
  const managerName = employee?.fullName;

  return {
    ...department,
    managerName,
    parentDepartmentName: department.parentDepartmentId ? parentDepartment?.name : '',
  };
};

export const mapDepartmentInput = (department: Department): EntityInput<Department> => {
  return {
    name: department.name,
    parentDepartmentId: department.parentDepartmentId || null,
    managerId: department.managerId,
  };
};

export const mapDepartments = (
  departments: Department[],
  parentDepartments: Department[] = [],
  employees: Employee[] = []
): Department[] => {
  return departments.map((department) => {
    const manager = employees.find(({ id }) => id === department.managerId);
    const parentDepartment = parentDepartments.find(({ id }) => id === department.parentDepartmentId);

    return mapDepartment(department, parentDepartment, manager);
  });
};

export const mapDepartmentFieldOptionsToFieldOptions = (
  fields: FormFieldProps<Department>[],
  departments?: Pick<Department, 'id' | 'name'>[],
  employees?: Pick<Employee, 'id' | 'fullName'>[]
): FormFieldProps<Department>[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.name === DEPARTMENT_FIELDS.parentDepartmentId.field &&
      departments?.length && {
        options: departments.map(mapDepartmentToFieldOption),
      }),
    ...(field.name === DEPARTMENT_FIELDS.managerId.field &&
      employees?.length && {
        options: employees.map(mapEmployeeToFieldOption),
      }),
  }));
};

export const mapDepartmentToFieldOption = (department: Pick<Department, 'id' | 'name'>): FieldOption => {
  return {
    label: department.name,
    value: String(department.id),
  };
};
