import { Country } from './common';

/* eslint-disable no-unused-vars */

export interface CompanyDTO {
  id?: number;
  name: string;
  countryCode: Country['code'];
}

export type CompanyFieldConfig = {
  [K in keyof CompanyDTO]: { field: K; name: string };
};
