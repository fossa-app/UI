import { Country, FlattenField, GeoAddress, NonNullableFields, TimeZone } from './common';

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
  id: number;
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
  address: AddressDTO | null;
}

export interface Branch extends BranchDTO {
  timeZoneName?: TimeZone['name'];
  isValid?: boolean;
  noPhysicalAddress?: boolean;
  address: Address | null;
  fullAddress?: string;
  geoAddress?: GeoAddress;
}

export type BranchFieldConfig = FlattenField<NonNullableFields<Branch>>;
