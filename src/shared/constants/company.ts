import { Company, CompanyFieldConfig, Module, SubModule, UserRole } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';
import { ViewItemProps } from 'components/UI/ViewDetails';

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
    label: 'Company Name',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyDetails,
  },
  {
    name: COMPANY_FIELDS.countryName!.field,
    label: 'Country',
    grid: { size: { xs: 12, md: 6 } },
    module: Module.companyManagement,
    subModule: SubModule.companyDetails,
  },
];
