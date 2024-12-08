/* eslint-disable no-unused-vars */

import { TimeZone } from './common';

export interface BranchDTO {
  id?: number;
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
}

// TODO: create Branch interface inherited from BranchDTO and add timeZoneName Field, map in branchSlice and use in Table views

export type BranchFieldConfig = {
  [K in keyof BranchDTO]: { field: K; name: string };
};
