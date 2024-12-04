import { Country } from './common';

/* eslint-disable no-unused-vars */

export interface Company {
  id?: number;
  name: string;
  country: Country;
}

export interface CompanyDTO extends Omit<Company, 'country'> {
  countryCode: Country['code'];
}

export type CompanyFieldConfig = {
  [K in keyof CompanyDTO]: { field: K; name: string };
};
