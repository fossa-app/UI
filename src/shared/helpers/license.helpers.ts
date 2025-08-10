import { CompanyLicense } from 'shared/models';
import { formatDateToLocaleString } from './date.helpers';

export const mapCompanyLicense = (license: CompanyLicense): CompanyLicense => {
  return {
    ...license,
    terms: {
      ...license.terms,
      notBefore: formatDateToLocaleString(license.terms.notBefore),
      notAfter: formatDateToLocaleString(license.terms.notAfter),
    },
  };
};
