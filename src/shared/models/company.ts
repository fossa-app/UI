import { Country, FlattenField } from './common';
import { CompanyLicense } from './license';

export interface CompanyDTO {
  id?: number;
  name: string;
  countryCode: Country['code'];
}

export interface Company extends CompanyDTO {
  countryName?: Country['name'];
}

export interface CompanyOffboardingInstructionData {
  branches?: number;
  employees?: number;
  departments?: number;
}

export type CompanyFieldConfig = {
  [K in keyof Company]: { field: K; name: string };
};

export type CompanyLicenseFieldConfig = FlattenField<CompanyLicense>;
