import { Employee, EmployeeFieldConfig, Module, SubModule } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';
import { Column } from 'components/UI/Table';
import { ViewItemProps } from 'components/UI/ViewDetails';

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

export const EMPLOYEE_TABLE_SCHEMA: Column<Employee>[] = [
  {
    name: EMPLOYEE_FIELDS.firstName.name,
    field: EMPLOYEE_FIELDS.firstName.field,
    width: 240,
  },
  {
    name: EMPLOYEE_FIELDS.lastName.name,
    field: EMPLOYEE_FIELDS.lastName.field,
    width: 240,
  },
  {
    name: EMPLOYEE_FIELDS.fullName.name,
    field: EMPLOYEE_FIELDS.fullName.field,
    width: 'auto',
  },
];

export const PROFILE_VIEW_DETAILS_SCHEMA: ViewItemProps<Employee>[] = [
  {
    name: EMPLOYEE_FIELDS.firstName.field,
    label: 'First Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.profile,
    subModule: SubModule.profileDetails,
  },
  {
    name: EMPLOYEE_FIELDS.lastName.field,
    label: 'Last Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.profile,
    subModule: SubModule.profileDetails,
  },
  {
    name: EMPLOYEE_FIELDS.fullName.field,
    label: 'Full Name',
    grid: { size: { xs: 12, md: 12 } },
    module: Module.profile,
    subModule: SubModule.profileDetails,
  },
];

export const PROFILE_DETAILS_FORM_SCHEMA = [...EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA].map((field) => ({
  ...field,
  module: Module.profile,
  subModule: SubModule.profileDetails,
}));
