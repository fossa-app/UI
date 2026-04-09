import type { CompanyRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { BridgeViewModel, Country, FlattenField } from './common';
import { CompanyLicense } from './license';

type BridgeCompany = BridgeViewModel<CompanyRetrievalModel>;

export type Company = Omit<BridgeCompany, 'name' | 'countryCode'> & {
  name: string;
  countryCode: Country['code'];
  countryName?: Country['name'];
};

export interface CompanyDatasourceTotals {
  branches?: number;
  employees?: number;
  departments?: number;
}

export type CompanyFieldConfig = {
  [K in keyof Company]: { field: K; name: string };
};

export type CompanyLicenseFieldConfig = FlattenField<CompanyLicense>;
