import { DEPARTMENT_FIELDS } from 'shared/constants';
import { Department, Employee, EntityInput } from 'shared/types';
import type { DepartmentRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { FormFieldProps, FieldOption } from 'components/UI/Form';
import { toBigIntId, toNullableBigIntId } from './data.helpers';
import { mapEmployeeToFieldOption } from './employee.helpers';

export const mapDepartmentRetrievalModel = (department: DepartmentRetrievalModel): Department => ({
  ...department,
  id: toBigIntId(department.id),
  parentDepartmentId: toNullableBigIntId(department.parentDepartmentId),
  managerId: toNullableBigIntId(department.managerId),
  name: department.name ?? '',
});

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
    const manager = department.managerId ? employees.find(({ id }) => id === department.managerId) : undefined;
    const parentDepartment = department.parentDepartmentId
      ? parentDepartments.find(({ id }) => id === department.parentDepartmentId)
      : undefined;

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
