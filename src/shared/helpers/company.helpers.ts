import { CompanyDTO } from 'shared/models';

export const mapCompanyDTO = (company: CompanyDTO): CompanyDTO => {
  return {
    name: company.name,
    countryCode: company.countryCode,
  };
};
