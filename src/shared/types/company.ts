import { Country, FlattenField } from './common';
import { CompanyLicense } from './license';

export interface Company {
  id: number;
  name: string;
  countryCode: Country['code'];
  countryName?: Country['name'];
}

export interface CompanyDatasourceTotals {
  branches?: number;
  employees?: number;
  departments?: number;
}

export type CompanyFieldConfig = {
  [K in keyof Company]: { field: K; name: string };
};

export type CompanyLicenseFieldConfig = FlattenField<CompanyLicense>;
