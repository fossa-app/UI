import { BranchFieldConfig, Module, SubModule, UserRole } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';

export const BRANCH_FIELDS: BranchFieldConfig = {
  id: {
    field: 'id',
    name: 'ID',
  },
  name: {
    field: 'name',
    name: 'Name',
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
    // TODO: set timezone field in Branch model
    name: 'timezone',
    label: 'Enter Timezone',
    grid: { size: { xs: 12, md: 6 } },
    options: [{ label: 'Timezone 1', value: '1' }],
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
    roles: [UserRole.administrator],
  },
];

export const BRANCH_SETUP_DETAILS_FORM_SCHEMA = [...BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA].map((field) => ({
  ...field,
  module: Module.branchSetup,
  subModule: SubModule.branchDetails,
}));
