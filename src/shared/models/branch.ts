import { Country, FlattenField, TimeZone } from './common';

export interface AddressDTO {
  line1?: string;
  line2?: string;
  city?: string;
  subdivision?: string;
  postalCode?: string;
  countryCode?: Country['code'];
}

export interface Address extends AddressDTO {
  countryName?: string;
}

export interface BranchDTO {
  id?: number;
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
  address: AddressDTO;
}

export interface Branch extends BranchDTO {
  timeZoneName?: TimeZone['name'];
  isValidCompanyTimeZone?: boolean;
  address: Address;
  fullAddress: string;
}

export type BranchFieldConfig = FlattenField<Branch>;
