import { Department, DepartmentFieldConfig, IconType, Module, SubModule, UserRole } from 'shared/models';
import { FormActionType, FormFieldType, FormActionName, FormProps } from 'components/UI/Form';
import { Action, Column } from 'components/UI/Table';
import { ViewDetailActionName, ViewDetailActionType, ViewDetailProps, ViewDetailType } from 'components/UI/ViewDetails';
import { renderDepartmentField } from 'pages/Manage/Department/components/DepartmentField';
import { ACTION_FIELD, ACTION_FIELDS } from './common';

export const DEPARTMENT_FIELDS: DepartmentFieldConfig = {
  id: {
    field: 'id',
    name: 'ID',
  },
  name: {
    field: 'name',
    name: 'Name',
  },
  parentDepartmentId: {
    field: 'parentDepartmentId',
    name: 'Parent Department',
  },
  parentDepartmentName: {
    field: 'parentDepartmentName',
    name: 'Parent Department',
  },
  managerId: {
    field: 'managerId',
    name: 'Manager',
  },
  managerName: {
    field: 'managerName',
    name: 'Manager',
  },
};

export const DEPARTMENT_MANAGEMENT_DETAILS_FORM_SCHEMA: FormProps<Department> = {
  module: Module.departmentManagement,
  subModule: SubModule.departmentDetails,
  title: 'Department Details',
  fields: [
    {
      type: FormFieldType.section,
      name: 'basicInfo',
      label: 'Basic Information',
      grid: { size: { xs: 12 } },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: DEPARTMENT_FIELDS.name.field,
      label: 'Enter Department Name',
      grid: { size: { xs: 12, md: 6 } },
      autoFocus: true,
      rules: {
        required: { value: true, message: 'Department Name is required' },
        maxLength: {
          value: 50,
          message: 'The Department Name must not exceed 50 characters.',
        },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.select,
      name: DEPARTMENT_FIELDS.parentDepartmentId.field,
      label: 'Select Parent Department',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.select,
      name: DEPARTMENT_FIELDS.managerId.field,
      label: 'Select Manager',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      rules: {
        required: { value: true, message: 'Manager is required' },
      },
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
      'aria-label': 'Cancel Department Button',
    },
    {
      actionType: FormActionType.loadingButton,
      label: 'Save',
      name: FormActionName.submit,
      type: 'submit',
      loadingPosition: 'end',
      endIcon: IconType.save,
      roles: [UserRole.administrator],
      'aria-label': 'Save Department Button',
    },
  ],
};

export const DEPARTMENT_VIEW_DETAILS_SCHEMA: ViewDetailProps<Department> = {
  title: 'Department Details',
  module: Module.departmentManagement,
  subModule: SubModule.departmentViewDetails,
  fields: [
    {
      name: 'basicInfo',
      label: 'Basic Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: DEPARTMENT_FIELDS.name.field,
      label: DEPARTMENT_FIELDS.name.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: DEPARTMENT_FIELDS.parentDepartmentName!.field,
      label: DEPARTMENT_FIELDS.parentDepartmentName!.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: DEPARTMENT_FIELDS.managerName!.field,
      label: DEPARTMENT_FIELDS.managerName!.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12 } },
    },
  ],
  actions: [
    {
      actionType: ViewDetailActionType.button,
      label: 'Edit',
      name: ViewDetailActionName.edit,
      roles: [UserRole.administrator],
      color: 'primary',
      variant: 'contained',
      'aria-label': 'Edit Department Button',
    },
  ],
};

export const DEPARTMENT_TABLE_SCHEMA: Column<Department>[] = [
  {
    name: DEPARTMENT_FIELDS.name.name,
    field: DEPARTMENT_FIELDS.name.field,
    width: 240,
  },
  {
    name: DEPARTMENT_FIELDS.parentDepartmentName!.name,
    field: DEPARTMENT_FIELDS.parentDepartmentName!.field,
    width: 'auto',
    renderBodyCell: (department) => renderDepartmentField({ department, field: DEPARTMENT_FIELDS.parentDepartmentName!.field }),
  },
  {
    name: DEPARTMENT_FIELDS.managerName!.name,
    field: DEPARTMENT_FIELDS.managerName!.field,
    width: 'auto',
    renderBodyCell: (department) => renderDepartmentField({ department, field: DEPARTMENT_FIELDS.managerName!.field }),
  },
  {
    name: ACTION_FIELD.name,
    field: ACTION_FIELD.field,
    align: 'right',
    width: 'auto',
  },
];

export const DEPARTMENT_TABLE_ACTIONS_SCHEMA: Action<Department>[] = [
  {
    name: ACTION_FIELDS.view.name,
    field: ACTION_FIELDS.view.field,
  },
  {
    name: ACTION_FIELDS.edit.name,
    field: ACTION_FIELDS.edit.field,
    roles: [UserRole.administrator],
  },
  {
    name: ACTION_FIELDS.delete.name,
    field: ACTION_FIELDS.delete.field,
    roles: [UserRole.administrator],
  },
];

export const DEPARTMENT_DETAILS_FORM_DEFAULT_VALUES: Department = {
  name: '',
  parentDepartmentId: null,
  managerId: null,
};
