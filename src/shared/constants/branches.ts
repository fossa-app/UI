import { Branch, BranchFormField, Module, SubModule } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';

type BranchFieldConfig = {
  [K in keyof Branch]: { field: K; name: string };
};

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

export const BRANCH_DETAILS_FORM_SCHEMA: FieldProps[] = [
  {
    type: FieldType.text,
    name: BranchFormField.name,
    label: 'Enter Branch name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
    autoFocus: true,
    rules: {
      required: { value: true, message: 'Branch name is required' },
      maxLength: {
        value: 50,
        message: 'The Branch name must not exceed 50 characters.',
      },
    },
  },
  {
    type: FieldType.select,
    name: BranchFormField.timezone,
    label: 'Enter Timezone',
    grid: { size: { xs: 12, md: 6 } },
    options: [{ label: 'Timezone 1', value: '1' }],
    module: Module.branchManagement,
    subModule: SubModule.branchDetails,
  },
];
