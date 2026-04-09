import { Country, FlattenField, GeoAddress, NonNullableFields, TimeZone } from './common';

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  subdivision?: string;
  postalCode?: string;
  countryCode?: Country['code'];
  countryName?: string;
}

export interface Branch {
  id: number;
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
  address: Address | null;
  timeZoneName?: TimeZone['name'];
  isValid?: boolean;
  noPhysicalAddress?: boolean;
  fullAddress?: string;
  geoAddress?: GeoAddress;
}

export type BranchFieldConfig = FlattenField<NonNullableFields<Branch>>;
