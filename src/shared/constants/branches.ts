import { Branch, BranchFieldConfig, IconType, Module, SubModule, UserRole } from 'shared/models';
import { FormActionType, FormFieldType, FormActionName, FormProps } from 'components/UI/Form';
import { Action, Column } from 'components/UI/Table';
import { ViewDetailActionName, ViewDetailActionType, ViewDetailProps, ViewDetailType } from 'components/UI/ViewDetails';
import { renderBranchField } from 'pages/Manage/Branch/components/BranchField';
import { renderBranchMapField } from 'pages/Manage/Branch/components/BranchMapField';
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
  noPhysicalAddress: {
    field: 'noPhysicalAddress',
    name: 'No Physical Address',
  },
  address: {
    field: 'address',
    name: 'Address Information',
    line1: {
      field: 'line1',
      name: 'Address Line 1',
    },
    line2: {
      field: 'line2',
      name: 'Address Line 2',
    },
    city: {
      field: 'city',
      name: 'City',
    },
    subdivision: {
      field: 'subdivision',
      name: 'Subdivision',
    },
    postalCode: {
      field: 'postalCode',
      name: 'Postal Code',
    },
    countryCode: {
      field: 'countryCode',
      name: 'Country Code',
    },
    countryName: {
      field: 'countryName',
      name: 'Country Name',
    },
  },
  fullAddress: {
    field: 'fullAddress',
    name: 'Address',
  },
  isValid: {
    field: 'isValid',
    name: 'Is Valid',
  },
  companyId: {
    field: 'companyId',
    name: 'Company ID',
  },
  geoAddress: {
    field: 'geoAddress',
    name: 'Geo Address',
    label: {
      field: 'label',
      name: 'Label',
    },
    lat: {
      field: 'lat',
      name: 'Latitude',
    },
    lng: {
      field: 'lng',
      name: 'Longitute',
    },
  },
};

export const BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA: FormProps<Branch> = {
  module: Module.branchManagement,
  subModule: SubModule.branchDetails,
  title: 'Branch Details',
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
      name: BRANCH_FIELDS.name.field,
      label: 'Enter Branch Name',
      grid: { size: { xs: 12, md: 6 } },
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
      type: FormFieldType.select,
      name: BRANCH_FIELDS.timeZoneId.field,
      label: 'Select TimeZone',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      rules: {
        required: { value: true, message: 'TimeZone is required' },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.section,
      name: BRANCH_FIELDS.address.field,
      label: BRANCH_FIELDS.address.name,
      grid: { size: { xs: 12 } },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.switch,
      name: BRANCH_FIELDS.noPhysicalAddress.field,
      label: BRANCH_FIELDS.noPhysicalAddress.name,
      grid: { size: { xs: 12 } },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line1!.field}`,
      label: 'Enter Address Line 1',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'Address Line 1 is required' },
        maxLength: {
          value: 50,
          message: 'Address Line 1 must not exceed 50 characters.',
        },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line2!.field}`,
      label: 'Enter Address Line 2',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        maxLength: {
          value: 50,
          message: 'Address Line 2 must not exceed 50 characters.',
        },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.city!.field}`,
      label: 'City',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'City is required' },
        maxLength: {
          value: 50,
          message: 'City must not exceed 50 characters.',
        },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.subdivision!.field}`,
      label: 'State',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'State is required' },
        maxLength: {
          value: 50,
          message: 'State must not exceed 50 characters.',
        },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.select,
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.countryCode!.field}`,
      label: 'Country',
      grid: { size: { xs: 12, md: 6 } },
      options: [],
      rules: {
        required: { value: true, message: 'Country is required' },
      },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.postalCode!.field}`,
      label: 'Postal Code',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'Postal Code is required' },
        minLength: {
          value: 4,
          message: 'Postal Code must be at least 4 characters long.',
        },
        maxLength: {
          value: 10,
          message: 'Postal Code must not exceed 10 characters.',
        },
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
      'aria-label': 'Cancel Branch Button',
    },
    {
      actionType: FormActionType.loadingButton,
      label: 'Save',
      name: FormActionName.submit,
      type: 'submit',
      loadingPosition: 'end',
      endIcon: IconType.save,
      roles: [UserRole.administrator],
      'aria-label': 'Save Branch Button',
    },
  ],
};

export const BRANCH_SETUP_DETAILS_FORM_SCHEMA: FormProps<Branch> = {
  ...BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA,
  module: Module.branchSetup,
  subModule: SubModule.branchDetails,
  actions: [
    {
      actionType: FormActionType.loadingButton,
      label: 'Next',
      name: FormActionName.submit,
      loadingPosition: 'end',
      endIcon: IconType.next,
      type: 'submit',
      roles: [UserRole.administrator],
      'aria-label': 'Create Branch Button',
    },
  ],
};

export const BRANCH_VIEW_DETAILS_SCHEMA: ViewDetailProps<Branch> = {
  title: 'Branch Details',
  module: Module.branchManagement,
  subModule: SubModule.branchViewDetails,
  fields: [
    {
      name: 'basicInfo',
      label: 'Basic Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: BRANCH_FIELDS.name.field,
      label: 'Branch Name',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: BRANCH_FIELDS.timeZoneName!.field,
      label: 'TimeZone',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) => renderBranchField({ branch, field: BRANCH_FIELDS.timeZoneName!.field, tooltip: 'Invalid TimeZone' }),
    },
    {
      name: BRANCH_FIELDS.address.field,
      label: 'Address Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line1!.field}`,
      label: 'Address Line 1',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) =>
        renderBranchField({
          branch,
          field: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line1!.field}`,
          tooltip: 'Invalid Address Line 1',
        }),
    },
    {
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line2!.field}`,
      label: 'Address Line 2',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) =>
        renderBranchField({
          branch,
          field: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line2!.field}`,
          tooltip: 'Invalid Address Line 2',
        }),
    },
    {
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.city!.field}`,
      label: 'City',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) =>
        renderBranchField({
          branch,
          field: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.city!.field}`,
          tooltip: 'Invalid City',
        }),
    },
    {
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.subdivision!.field}`,
      label: 'State',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) =>
        renderBranchField({
          branch,
          field: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.subdivision!.field}`,
          tooltip: 'Invalid State',
        }),
    },
    {
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.countryName!.field}`,
      label: 'Country',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) =>
        renderBranchField({
          branch,
          field: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.countryName!.field}`,
          tooltip: 'Invalid Country',
        }),
    },
    {
      name: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.postalCode!.field}`,
      label: 'Postal Code',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
      renderDetailField: (branch) =>
        renderBranchField({
          branch,
          field: `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.postalCode!.field}`,
          tooltip: 'Invalid Postal Code',
        }),
    },
    {
      name: BRANCH_FIELDS.geoAddress.field,
      label: 'Location Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: `${BRANCH_FIELDS.geoAddress.field}.${BRANCH_FIELDS.geoAddress.label.field}`,
      label: '',
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 8 } },
      renderDetailField: (branch) => renderBranchMapField({ branch }),
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
      'aria-label': 'Edit Branch Button',
    },
  ],
};

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
    renderBodyCell: (branch) => renderBranchField({ branch, field: BRANCH_FIELDS.timeZoneName!.field, tooltip: 'Invalid TimeZone' }),
  },
  {
    name: BRANCH_FIELDS.fullAddress!.name,
    field: BRANCH_FIELDS.fullAddress!.field,
    width: 'auto',
    renderBodyCell: (branch) => renderBranchField({ branch, field: BRANCH_FIELDS.fullAddress!.field, tooltip: 'Invalid Address' }),
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

export const BRANCH_DETAILS_FORM_DEFAULT_VALUES: Branch = {
  name: '',
  timeZoneId: '',
  address: null,
};
