import { Branch, BranchFieldConfig, Module, SubModule, UserRole } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';
import { Action, Column } from 'components/UI/Table';
import { ViewItemProps } from 'components/UI/ViewDetails';
import { ACTION_FIELD, ACTION_FIELDS } from './common';

export const BRANCH_FIELDS: BranchFieldConfig = {
  id: {
    field: 'id',
    name: 'ID',
  },
  name: {
    field: 'name',
    name: 'Name',
  },
  timeZoneId: {
    field: 'timeZoneId',
    name: 'TimeZone',
  },
  timeZoneName: {
    field: 'timeZoneName',
    name: 'TimeZone',
  },
};

export const BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA: FieldProps[] = [
  {
    type: FieldType.text,
    name: BRANCH_FIELDS.name.field,
    label: 'Enter Branch Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
    autoFocus: true,
    rules: {
      required: { value: true, message: 'Branch Name is required' },
      maxLength: {
        value: 50,
        message: 'The Branch Name must not exceed 50 characters.',
      },
    },
    roles: [UserRole.administrator],
  },
  {
    type: FieldType.select,
    name: BRANCH_FIELDS.timeZoneId.field,
    label: 'Select TimeZone',
    grid: { size: { xs: 12, md: 6 } },
    options: [],
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
    rules: {
      required: { value: true, message: 'TimeZone is required' },
    },
    roles: [UserRole.administrator],
  },
];

export const BRANCH_VIEW_DETAILS_SCHEMA: ViewItemProps<Branch>[] = [
  {
    name: BRANCH_FIELDS.name.field,
    label: 'Branch Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
  },
  {
    name: BRANCH_FIELDS.timeZoneName!.field,
    label: 'TimeZone',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
  },
];

export const BRANCH_SETUP_DETAILS_FORM_SCHEMA = [...BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA].map((field) => ({
  ...field,
  module: Module.branchSetup,
  subModule: SubModule.branchDetails,
}));

export const BRANCH_TABLE_SCHEMA: Column<Branch>[] = [
  {
    name: BRANCH_FIELDS.name.name,
    field: BRANCH_FIELDS.name.field,
    width: 240,
  },
  {
    name: BRANCH_FIELDS.timeZoneName!.name,
    field: BRANCH_FIELDS.timeZoneName!.field,
    width: 240,
  },
  {
    name: ACTION_FIELD.name,
    field: ACTION_FIELD.field,
    align: 'right',
    width: 'auto',
  },
];

export const BRANCH_TABLE_ACTIONS_SCHEMA: Action<Branch>[] = [
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
