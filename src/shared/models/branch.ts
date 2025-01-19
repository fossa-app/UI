import { TimeZone } from './common';

export interface BranchDTO {
  id?: number;
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
}

export interface Branch extends BranchDTO {
  timeZoneName?: TimeZone['name'];
  isValidCompanyTimeZone?: boolean;
}

export type BranchFieldConfig = {
  [K in keyof Branch]: { field: K; name: string };
};
