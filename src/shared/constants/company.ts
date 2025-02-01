import { Company, CompanyFieldConfig, CompanyLicense, CompanyLicenseFieldConfig, Module, SubModule, UserRole } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';
import { ViewItemProps } from 'components/UI/ViewDetails';
import { renderCompanyLicenseIdField } from 'pages/Manage/Company/components/CompanyLicenseIdField';

export const COMPANY_FIELDS: CompanyFieldConfig = {
  id: {
    field: 'id',
    name: 'ID',
  },
  name: {
    field: 'name',
    name: 'Name',
  },
  countryCode: {
    field: 'countryCode',
    name: 'Country',
  },
  countryName: {
    field: 'countryName',
    name: 'Country',
  },
};

export const COMPANY_LICENSE_FIELDS: CompanyLicenseFieldConfig = {
  terms: {
    field: 'terms',
    name: 'Terms',
    licensee: {
      field: 'licensee',
      name: 'Licensee',
      shortName: {
        field: 'shortName',
        name: 'Short Name',
      },
      longName: {
        field: 'longName',
        name: 'Long Name',
      },
    },
    licensor: {
      field: 'licensor',
      name: 'Licensor',
      shortName: {
        field: 'shortName',
        name: 'Short Name',
      },
      longName: {
        field: 'longName',
        name: 'Long Name',
      },
    },
    notBefore: {
      field: 'notBefore',
      name: 'Valid From',
    },
    notAfter: {
      field: 'notAfter',
      name: 'Valid To',
    },
  },
  entitlements: {
    field: 'entitlements',
    name: 'Entitlements',
    companyId: {
      field: 'companyId',
      name: 'Company ID',
    },
    maximumBranchCount: {
      field: 'maximumBranchCount',
      name: 'Maximum Branch Count',
    },
    maximumEmployeeCount: {
      field: 'maximumEmployeeCount',
      name: 'Maximum Employee Count',
    },
  },
};

export const COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA: FieldProps[] = [
  {
    type: FieldType.text,
    name: COMPANY_FIELDS.name.field,
    label: 'Enter Company Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyDetails,
    autoFocus: true,
    rules: {
      required: { value: true, message: 'Company Name is required' },
      maxLength: {
        value: 50,
        message: 'The Company Name must not exceed 50 characters.',
      },
    },
    roles: [UserRole.administrator],
  },
  {
    type: FieldType.select,
    name: COMPANY_FIELDS.countryCode.field,
    label: 'Select Country',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyDetails,
    rules: {
      required: { value: true, message: 'Country is required' },
    },
    options: [],
    roles: [UserRole.administrator],
  },
];

export const COMPANY_SETUP_DETAILS_FORM_SCHEMA = [...COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA].map((field) => ({
  ...field,
  module: Module.companySetup,
  subModule: SubModule.companyDetails,
}));

export const COMPANY_VIEW_DETAILS_SCHEMA: ViewItemProps<Company>[] = [
  {
    name: COMPANY_FIELDS.name.field,
    label: COMPANY_FIELDS.name.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyViewDetails,
  },
  {
    name: COMPANY_FIELDS.countryName!.field,
    label: COMPANY_FIELDS.countryName!.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyViewDetails,
  },
];

export const COMPANY_LICENSE_VIEW_DETAILS_SCHEMA: ViewItemProps<CompanyLicense>[] = [
  {
    name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.longName.field}`,
    label: COMPANY_LICENSE_FIELDS.terms.licensee.longName.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
  },
  {
    name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.shortName.field}`,
    label: COMPANY_LICENSE_FIELDS.terms.licensee.shortName.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
  },
  {
    name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.notBefore.field}`,
    label: COMPANY_LICENSE_FIELDS.terms.notBefore.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
  },
  {
    name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.notAfter.field}`,
    label: COMPANY_LICENSE_FIELDS.terms.notAfter.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
  },
  {
    name: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.companyId.field}`,
    label: COMPANY_LICENSE_FIELDS.entitlements.companyId.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
    renderDetailField: (company) => renderCompanyLicenseIdField(company),
  },
  {
    name: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumBranchCount.field}`,
    label: COMPANY_LICENSE_FIELDS.entitlements.maximumBranchCount.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
  },
  {
    name: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumEmployeeCount.field}`,
    label: COMPANY_LICENSE_FIELDS.entitlements.maximumEmployeeCount.name,
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyLicenseViewDetails,
  },
];
