import { CompanyFieldConfig, Module, SubModule, UserRole } from 'shared/models';
import { FieldProps, FieldType } from 'components/UI/Form';

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
};

export const COMPANY_SETUP_DETAILS_FORM_SCHEMA: FieldProps[] = [
  {
    type: FieldType.text,
    name: COMPANY_FIELDS.name.field,
    label: 'Enter Company Name',
    grid: { size: { xs: 12 } },
    module: Module.companySetup,
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
    grid: { size: { xs: 12 } },
    module: Module.companySetup,
    subModule: SubModule.companyDetails,
    rules: {
      required: { value: true, message: 'Country is required' },
    },
    options: [],
    roles: [UserRole.administrator],
  },
];
