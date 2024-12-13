import { Country } from './common';

export interface CompanyDTO {
  id?: number;
  name: string;
  countryCode: Country['code'];
}

export interface Company extends CompanyDTO {
  countryName?: Country['name'];
}

export type CompanyFieldConfig = {
  [K in keyof Company]: { field: K; name: string };
};
