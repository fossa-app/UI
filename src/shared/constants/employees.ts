import { Employee, EmployeeFieldConfig, EntityInput, IconType, Module, SubModule, UserRole } from 'shared/types';
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
  jobTitle: {
    field: 'jobTitle',
    name: 'Job Title',
  },
  assignedBranchId: {
    field: 'assignedBranchId',
    name: 'Assigned Branch ID',
  },
  assignedBranchName: {
    field: 'assignedBranchName',
    name: 'Assigned Branch',
  },
  assignedDepartmentId: {
    field: 'assignedDepartmentId',
    name: 'Assigned Department ID',
  },
  assignedDepartmentName: {
    field: 'assignedDepartmentName',
    name: 'Assigned Department',
  },
  reportsToId: {
    field: 'reportsToId',
    name: 'Reports To ID',
  },
  reportsToName: {
    field: 'reportsToName',
    name: 'Manager',
  },
};

export const EMPLOYEE_TABLE_SCHEMA: Column<Employee>[] = [
  {
    name: EMPLOYEE_FIELDS.firstName.name,
    field: EMPLOYEE_FIELDS.firstName.field,
    width: 200,
  },
  {
    name: EMPLOYEE_FIELDS.lastName.name,
    field: EMPLOYEE_FIELDS.lastName.field,
    width: 200,
  },
  {
    name: EMPLOYEE_FIELDS.fullName.name,
    field: EMPLOYEE_FIELDS.fullName.field,
    width: 200,
  },
  {
    name: EMPLOYEE_FIELDS.jobTitle.name,
    field: EMPLOYEE_FIELDS.jobTitle.field,
    width: 200,
  },
  {
    name: EMPLOYEE_FIELDS.assignedBranchName!.name,
    field: EMPLOYEE_FIELDS.assignedBranchName!.field,
    width: 200,
  },
  {
    name: EMPLOYEE_FIELDS.assignedDepartmentName!.name,
    field: EMPLOYEE_FIELDS.assignedDepartmentName!.field,
    width: 200,
  },
  {
    name: EMPLOYEE_FIELDS.reportsToName!.name,
    field: EMPLOYEE_FIELDS.reportsToName!.field,
    width: 200,
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
      label: 'First Name',
      grid: { size: { xs: 12, md: 6 } },
      autoFocus: true,
      rules: {
        required: { value: true, message: 'First Name is required' },
      },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.lastName.field,
      label: 'Last Name',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'Last Name is required' },
      },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.fullName.field,
      label: 'Full Name',
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

export const DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA: FormProps<void> = {
  module: Module.deleteEmployee,
  subModule: SubModule.employeeDetails,
  title: 'Delete Profile',
  fields: [],
  actions: [
    {
      actionType: FormActionType.loadingButton,
      label: 'Delete Profile',
      name: FormActionName.submit,
      loadingPosition: 'end',
      endIcon: IconType.remove,
      color: 'error',
      type: 'submit',
      'aria-label': 'Delete Profile Button',
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
    {
      name: EMPLOYEE_FIELDS.jobTitle.field,
      label: 'Job Title',
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
      name: EMPLOYEE_FIELDS.jobTitle.field,
      label: 'Job Title',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: 'additionalInfo',
      label: 'Additional Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: EMPLOYEE_FIELDS.assignedBranchName!.field,
      label: 'Assigned Branch',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: EMPLOYEE_FIELDS.assignedDepartmentName!.field,
      label: 'Assigned Department',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: EMPLOYEE_FIELDS.reportsToName!.field,
      label: 'Manager',
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
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.jobTitle.field,
      label: 'Job Title',
      grid: { size: { xs: 12, md: 6 } },
      autoFocus: true,
      rules: {
        required: { value: true, message: 'Job Title is required' },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.section,
      name: 'additionalInfo',
      label: 'Additional Information',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.autocomplete,
      name: EMPLOYEE_FIELDS.assignedBranchId!.field,
      label: 'Select Branch',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.autocomplete,
      name: EMPLOYEE_FIELDS.assignedDepartmentId!.field,
      label: 'Select Department',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.autocomplete,
      name: EMPLOYEE_FIELDS.reportsToId!.field,
      label: 'Select Manager',
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
  module: Module.profile,
  subModule: SubModule.profileDetails,
  title: 'Profile Details',
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
      label: 'First Name',
      grid: { size: { xs: 12, md: 6 } },
      autoFocus: true,
      rules: {
        required: { value: true, message: 'First Name is required' },
      },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.lastName.field,
      label: 'Last Name',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'Last Name is required' },
      },
    },
    {
      type: FormFieldType.text,
      name: EMPLOYEE_FIELDS.fullName.field,
      label: 'Full Name',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.labelValue,
      name: EMPLOYEE_FIELDS.jobTitle.field,
      label: 'Job Title',
      grid: { size: { xs: 12 } },
    },
  ],
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

export const EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES: EntityInput<Employee> = {
  firstName: '',
  lastName: '',
  fullName: '',
  jobTitle: '',
  assignedBranchId: null,
  assignedDepartmentId: null,
  reportsToId: null,
};
