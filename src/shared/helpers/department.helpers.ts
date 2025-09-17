import { DEPARTMENT_FIELDS } from 'shared/constants';
import { Department, DepartmentDTO, Employee, EmployeeDTO, EntityInput } from 'shared/models';
import { FormFieldProps, FieldOption } from 'components/UI/Form';
import { mapEmployeeToFieldOption } from './employee.helpers';

export const mapDepartment = (department: DepartmentDTO, parentDepartment?: DepartmentDTO, employee?: EmployeeDTO): Department => {
  const managerName = employee?.fullName;

  return {
    ...department,
    managerName,
    parentDepartmentName: department.parentDepartmentId ? parentDepartment?.name : '',
  };
};

export const mapDepartmentDTO = (department: Department): EntityInput<DepartmentDTO> => {
  return {
    name: department.name,
    parentDepartmentId: department.parentDepartmentId || null,
    managerId: department.managerId,
  };
};

export const mapDepartments = (
  departments: DepartmentDTO[],
  parentDepartments: DepartmentDTO[] = [],
  employees: EmployeeDTO[] = []
): Department[] => {
  return departments.map((department) => {
    const manager = employees.find(({ id }) => id === department.managerId);
    const parentDepartment = parentDepartments.find(({ id }) => id === department.parentDepartmentId);

    return mapDepartment(department, parentDepartment, manager);
  });
};

export const mapDepartmentFieldOptionsToFieldOptions = (
  fields: FormFieldProps<Department>[],
  departments?: Department[],
  employees?: Employee[]
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

export const mapDepartmentToFieldOption = (department: Department): FieldOption => {
  return {
    label: department.name,
    value: String(department.id),
  };
};
