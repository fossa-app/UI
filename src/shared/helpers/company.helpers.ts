import { Company, CompanyDTO, Country } from 'shared/models';

export const mapCompany = (company: CompanyDTO, countries: Country[]): Company => {
  return {
    ...company,
    countryName: countries.find(({ code }) => code === company.countryCode)?.name,
  };
};
