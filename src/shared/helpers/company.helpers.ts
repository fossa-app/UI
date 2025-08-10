import { Company, CompanyDTO, Country } from 'shared/models';
import { COMPANY_LICENSE_FIELDS } from 'shared/constants';
import { FormFieldProps, FormFieldType, FieldOption } from 'components/UI/Form';

export const mapCompany = (company: CompanyDTO, countries: Country[]): Company => {
  return {
    ...company,
    countryName: countries.find(({ code }) => code === company.countryCode)?.name,
  };
};

export const mapCountriesToFieldOptions = (fields: FormFieldProps<Company>[], countries?: Country[]): FormFieldProps<Company>[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.type === FormFieldType.select &&
      countries?.length && {
        options: countries.map(mapCountryToFieldOption),
      }),
  }));
};

export const mapCountryToFieldOption = (country: Country): FieldOption => {
  return {
    label: country.name,
    value: country.code,
  };
};

export const createCompanyLicenseEntitlementsFieldsMap = (params: {
  branches?: number;
  maximumBranchCount?: number;
  branchUsagePercent: number;
  employees?: number;
  maximumEmployeeCount?: number;
  employeeUsagePercent: number;
  departments?: number;
  maximumDepartmentCount?: number;
  departmentUsagePercent: number;
}) => {
  return {
    [`${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumBranchCount.field}`]: {
      usage: params.branches,
      max: params.maximumBranchCount,
      value: params.branchUsagePercent,
      labelPrefix: 'Branch usage',
      field: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumBranchCount.field}`,
    },
    [`${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumEmployeeCount.field}`]: {
      usage: params.employees,
      max: params.maximumEmployeeCount,
      value: params.employeeUsagePercent,
      labelPrefix: 'Employee usage',
      field: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumEmployeeCount.field}`,
    },
    [`${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumDepartmentCount.field}`]: {
      usage: params.departments,
      max: params.maximumDepartmentCount,
      value: params.departmentUsagePercent,
      labelPrefix: 'Department usage',
      field: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumDepartmentCount.field}`,
    },
  };
};
