import { Branch } from 'shared/models';

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
