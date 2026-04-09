import type { BranchRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import type { AddressModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';
import { BridgeViewModel, FlattenField, GeoAddress, NonNullableFields, TimeZone } from './common';

export type Address = Partial<BridgeViewModel<AddressModel>> & {
  countryName?: string;
};

type BridgeBranch = BridgeViewModel<BranchRetrievalModel>;

export type Branch = Omit<BridgeBranch, 'companyId' | 'name' | 'timeZoneId' | 'address'> & {
  companyId?: number;
  name: string;
  timeZoneId: TimeZone['id'];
  address: Address | null;
  timeZoneName?: TimeZone['name'];
  isValid?: boolean;
  noPhysicalAddress?: boolean;
  fullAddress?: string;
  geoAddress?: GeoAddress;
};

export type BranchFieldConfig = FlattenField<NonNullableFields<Branch>>;
