import { Employee, EmployeeFieldConfig, Module, SubModule, UserRole } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';
import { Action, Column } from 'components/UI/Table';
import { ViewDetailProps, ViewDetailType } from 'components/UI/ViewDetails';
import { ACTION_FIELD, ACTION_FIELDS } from './common';

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
  assignedBranchId: {
    field: 'assignedBranchId',
    name: 'Assigned Branch ID',
  },
  assignedBranchName: {
    field: 'assignedBranchName',
    name: 'Assigned Branch',
  },
};

export const EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA: FieldProps<Employee>[] = [
  {
    type: FieldType.section,
    name: 'basicInfo',
    label: 'Basic Information',
    grid: { size: { xs: 12 } },
    module: Module.employeeSetup,
    subModule: SubModule.employeeDetails,
  },
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
  {
    name: EMPLOYEE_FIELDS.assignedBranchName!.name,
    field: EMPLOYEE_FIELDS.assignedBranchName!.field,
    width: 240,
  },
  {
    name: ACTION_FIELD.name,
    field: ACTION_FIELD.field,
    align: 'right',
    width: 'auto',
  },
];

export const EMPLOYEE_TABLE_ACTIONS_SCHEMA: Action<Employee>[] = [
  {
    name: ACTION_FIELDS.view.name,
    field: ACTION_FIELDS.view.field,
  },
  {
    name: ACTION_FIELDS.edit.name,
    field: ACTION_FIELDS.edit.field,
    roles: [UserRole.administrator],
  },
];

export const PROFILE_VIEW_DETAILS_SCHEMA: ViewDetailProps<Employee>[] = [
  {
    name: 'basicInfo',
    label: 'Basic Information',
    type: ViewDetailType.section,
    grid: { size: { xs: 12 } },
    module: Module.profile,
    subModule: SubModule.profileViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.firstName.field,
    label: 'First Name',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.profile,
    subModule: SubModule.profileViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.lastName.field,
    label: 'Last Name',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.profile,
    subModule: SubModule.profileViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.fullName.field,
    label: 'Full Name',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12, md: 12 } },
    module: Module.profile,
    subModule: SubModule.profileViewDetails,
  },
];

export const EMPLOYEE_VIEW_DETAILS_SCHEMA: ViewDetailProps<Employee>[] = [
  {
    name: 'basicInfo',
    label: 'Basic Information',
    type: ViewDetailType.section,
    grid: { size: { xs: 12 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.firstName.field,
    label: 'First Name',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.lastName.field,
    label: 'Last Name',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.fullName.field,
    label: 'Full Name',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeViewDetails,
  },
  {
    name: 'branchInfo',
    label: 'Branch Information',
    type: ViewDetailType.section,
    grid: { size: { xs: 12 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeViewDetails,
  },
  {
    name: EMPLOYEE_FIELDS.assignedBranchName!.field,
    label: 'Assigned Branch',
    type: ViewDetailType.labelValue,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeViewDetails,
  },
];

export const OTHER_EMPLOYEE_DETAILS_FORM_SCHEMA: FieldProps<Employee>[] = [
  {
    type: FieldType.section,
    name: 'basicInfo',
    label: 'Basic Information',
    grid: { size: { xs: 12 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeDetails,
  },
  {
    type: FieldType.labelValue,
    name: EMPLOYEE_FIELDS.firstName.field,
    label: 'First Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeDetails,
  },
  {
    type: FieldType.labelValue,
    name: EMPLOYEE_FIELDS.lastName.field,
    label: 'Last Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeDetails,
  },
  {
    type: FieldType.labelValue,
    name: EMPLOYEE_FIELDS.fullName.field,
    label: 'Full Name',
    grid: { size: { xs: 12 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeDetails,
  },
  {
    type: FieldType.section,
    name: 'branchInfo',
    label: 'Branch Information',
    grid: { size: { xs: 12 } },
    module: Module.employeeManagement,
    subModule: SubModule.employeeDetails,
  },
  {
    type: FieldType.select,
    name: EMPLOYEE_FIELDS.assignedBranchId!.field,
    label: 'Select Branch',
    grid: { size: { xs: 12, md: 6 } },
    options: [],
    module: Module.employeeManagement,
    subModule: SubModule.employeeDetails,
    roles: [UserRole.administrator],
  },
];

export const PROFILE_DETAILS_FORM_SCHEMA = [...EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA].map((field) => ({
  ...field,
  module: Module.profile,
  subModule: SubModule.profileDetails,
}));
