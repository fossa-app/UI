import { Employee, EmployeeFieldConfig, IconType, Module, SubModule, UserRole } from 'shared/models';
import { FormActionType, FormFieldType, FormActionName, FormProps } from 'components/UI/Form';
import { Action, Column } from 'components/UI/Table';
import { ViewDetailActionName, ViewDetailActionType, ViewDetailProps, ViewDetailType } from 'components/UI/ViewDetails';
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

export const CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA: FormProps<Employee> = {
  module: Module.createEmployee,
  subModule: SubModule.employeeDetails,
  title: 'Employee Details',
  fields: [
    {
      type: FormFieldType.section,
      name: 'basicInfo',
      label: 'Basic Information',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.firstName.field,
      label: 'Enter First Name',
      grid: { size: { xs: 12, md: 6 } },
      autoFocus: true,
      rules: {
        required: { value: true, message: 'First Name is required' },
      },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.lastName.field,
      label: 'Enter Last Name',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'Last Name is required' },
      },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.fullName.field,
      label: 'Enter Full Name',
      grid: { size: { xs: 12 } },
    },
  ],
  actions: [
    {
      actionType: FormActionType.loadingButton,
      label: 'Finish',
      name: FormActionName.submit,
      type: 'submit',
      loadingPosition: 'end',
      endIcon: IconType.done,
      'aria-label': 'Create Employee',
    },
  ],
};

export const PROFILE_VIEW_DETAILS_SCHEMA: ViewDetailProps<Employee> = {
  module: Module.profile,
  subModule: SubModule.profileViewDetails,
  title: 'Profile Details',
  fields: [
    {
      name: 'basicInfo',
      label: 'Basic Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: EMPLOYEE_FIELDS.firstName.field,
      label: 'First Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: EMPLOYEE_FIELDS.lastName.field,
      label: 'Last Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: EMPLOYEE_FIELDS.fullName.field,
      label: 'Full Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 12 } },
    },
  ],
  actions: [
    {
      actionType: ViewDetailActionType.button,
      label: 'Edit',
      name: ViewDetailActionName.edit,
      color: 'primary',
      variant: 'contained',
      'aria-label': 'Edit Profile Button',
    },
  ],
};

export const EMPLOYEE_VIEW_DETAILS_SCHEMA: ViewDetailProps<Employee> = {
  module: Module.employeeManagement,
  subModule: SubModule.employeeViewDetails,
  title: 'Employee Details',
  fields: [
    {
      name: 'basicInfo',
      label: 'Basic Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: EMPLOYEE_FIELDS.firstName.field,
      label: 'First Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: EMPLOYEE_FIELDS.lastName.field,
      label: 'Last Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: EMPLOYEE_FIELDS.fullName.field,
      label: 'Full Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12 } },
    },
    {
      name: 'branchInfo',
      label: 'Branch Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: EMPLOYEE_FIELDS.assignedBranchName!.field,
      label: 'Assigned Branch',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
  ],
};

export const EMPLOYEE_DETAILS_FORM_SCHEMA: FormProps<Employee> = {
  module: Module.employeeManagement,
  subModule: SubModule.employeeDetails,
  title: 'Employee Details',
  fields: [
    {
      type: FormFieldType.section,
      name: 'basicInfo',
      label: 'Basic Information',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.labelValue,
      name: EMPLOYEE_FIELDS.firstName.field,
      label: 'First Name',
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      type: FormFieldType.labelValue,
      name: EMPLOYEE_FIELDS.lastName.field,
      label: 'Last Name',
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      type: FormFieldType.labelValue,
      name: EMPLOYEE_FIELDS.fullName.field,
      label: 'Full Name',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.section,
      name: 'branchInfo',
      label: 'Branch Information',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.autocomplete,
      name: EMPLOYEE_FIELDS.assignedBranchId!.field,
      label: 'Search Branch',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      roles: [UserRole.administrator],
    },
  ],
  actions: [
    {
      actionType: FormActionType.button,
      label: 'Cancel',
      name: FormActionName.cancel,
      variant: 'text',
      color: 'secondary',
      roles: [UserRole.administrator],
      'aria-label': 'Cancel Employee',
    },
    {
      actionType: FormActionType.loadingButton,
      label: 'Save',
      name: FormActionName.submit,
      type: 'submit',
      loadingPosition: 'end',
      endIcon: IconType.save,
      roles: [UserRole.administrator],
      'aria-label': 'Save Employee',
    },
  ],
};

export const PROFILE_DETAILS_FORM_SCHEMA: FormProps<Employee> = {
  ...CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA,
  module: Module.profile,
  subModule: SubModule.profileDetails,
  title: 'Profile Details',
  actions: [
    {
      actionType: FormActionType.button,
      label: 'Cancel',
      name: FormActionName.cancel,
      variant: 'text',
      color: 'secondary',
      'aria-label': 'Cancel Profile',
    },
    {
      actionType: FormActionType.loadingButton,
      label: 'Save',
      name: FormActionName.submit,
      loadingPosition: 'end',
      endIcon: IconType.save,
      type: 'submit',
      'aria-label': 'Save Profile',
    },
  ],
};

export const EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES: Employee = {
  firstName: '',
  lastName: '',
  fullName: '',
  assignedBranchId: null,
};
