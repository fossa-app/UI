import { CompanyLicense } from 'shared/models';

export const mapCompanyLicense = (license: CompanyLicense): CompanyLicense => {
  return {
    ...license,
    terms: {
      ...license.terms,
      notBefore: new Date(license.terms.notBefore).toLocaleDateString(),
      notAfter: new Date(license.terms.notAfter).toLocaleDateString(),
    },
  };
};
