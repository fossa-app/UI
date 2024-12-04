import { EmployeeFieldConfig, Module, SubModule } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';

export const EMPLOYEE_FIELDS: EmployeeFieldConfig = {
  id: {
    field: 'id',
    name: 'ID',
  },
  firstName: {
    field: 'firstName',
    name: 'First Name',
  },
  lastName: {
    field: 'lastName',
    name: 'Last Name',
  },
  fullName: {
    field: 'fullName',
    name: 'Full Name',
  },
};

export const EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA: FieldProps[] = [
  {
    type: FieldType.text,
    name: EMPLOYEE_FIELDS.firstName.field,
    label: 'Enter First Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeSetup,
    subModule: SubModule.employeeDetails,
    autoFocus: true,
    rules: {
      required: { value: true, message: 'First Name is required' },
    },
  },
  {
    type: FieldType.text,
    name: EMPLOYEE_FIELDS.lastName.field,
    label: 'Enter Last Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeSetup,
    subModule: SubModule.employeeDetails,
    rules: {
      required: { value: true, message: 'Last Name is required' },
    },
  },
  {
    type: FieldType.text,
    name: EMPLOYEE_FIELDS.fullName.field,
    label: 'Enter Full Name',
    grid: { size: { xs: 12 } },
    module: Module.employeeSetup,
    subModule: SubModule.employeeDetails,
  },
];
