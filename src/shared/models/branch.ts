/* eslint-disable no-unused-vars */

import { TimeZone } from './common';

export interface BranchDTO {
  id?: number;
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
}

export interface Branch extends BranchDTO {
  timeZoneName?: TimeZone['name'];
}

export type BranchFieldConfig = {
  [K in keyof Branch]: { field: K; name: string };
};
