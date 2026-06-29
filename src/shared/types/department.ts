import type { DepartmentRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import type { BridgeViewModel } from './common';

type BridgeDepartment = BridgeViewModel<DepartmentRetrievalModel>;

export type Department = Omit<BridgeDepartment, 'name'> & {
  name: string;
  parentDepartmentName?: string;
  managerName?: string;
};

export type DepartmentFieldConfig = {
  [K in keyof Department]: { field: K; name: string };
};
