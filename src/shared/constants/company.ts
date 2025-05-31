import {
  Company,
  CompanyFieldConfig,
  CompanyLicense,
  CompanyLicenseFieldConfig,
  IconType,
  Module,
  SubModule,
  UserRole,
} from 'shared/models';
import { FormActionType, FormFieldType, FormActionName, FormProps } from 'components/UI/Form';
import { ViewDetailActionName, ViewDetailActionType, ViewDetailProps, ViewDetailType } from 'components/UI/ViewDetails';
import { renderCopyableField } from 'components/UI/CopyableField';

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
    maximumDepartmentCount: {
      field: 'maximumDepartmentCount',
      name: 'Maximum Department Count',
    },
  },
};

export const COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA: FormProps<Company> = {
  module: Module.companyManagement,
  subModule: SubModule.companyDetails,
  title: 'Company Details',
  fields: [
    {
      type: FormFieldType.section,
      name: 'basicInfo',
      label: 'Basic Information',
      grid: { size: { xs: 12 } },
      roles: [UserRole.administrator],
    },
    {
      type: FormFieldType.text,
      name: COMPANY_FIELDS.name.field,
      label: 'Enter Company Name',
      grid: { size: { xs: 12, md: 6 } },
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
      type: FormFieldType.select,
      name: COMPANY_FIELDS.countryCode.field,
      label: 'Select Country',
      grid: { size: { xs: 12, md: 6 } },
      rules: {
        required: { value: true, message: 'Country is required' },
      },
      options: [],
      roles: [UserRole.administrator],
    },
  ],
  actions: [
    {
      actionType: FormActionType.button,
      label: 'Cancel',
      name: FormActionName.cancel,
      variant: 'text',
      color: 'secondary',
      'aria-label': 'Cancel Company Button',
    },
    {
      actionType: FormActionType.loadingButton,
      label: 'Save',
      name: FormActionName.submit,
      type: 'submit',
      loadingPosition: 'end',
      endIcon: IconType.save,
      'aria-label': 'Save Company Button',
    },
  ],
};

export const CREATE_COMPANY_DETAILS_FORM_SCHEMA: FormProps<Company> = {
  ...COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA,
  module: Module.createCompany,
  subModule: SubModule.companyDetails,
  actions: [
    {
      actionType: FormActionType.loadingButton,
      label: 'Next',
      name: FormActionName.submit,
      loadingPosition: 'end',
      endIcon: IconType.next,
      type: 'submit',
      roles: [UserRole.administrator],
      'aria-label': 'Create Company Button',
    },
  ],
};

export const UPLOAD_COMPANY_LICENSE_DETAILS_FORM_SCHEMA: FormProps<CompanyLicense> = {
  module: Module.uploadCompanyLicense,
  subModule: SubModule.companyLicenseDetails,
  title: 'Company License Details',
  fields: [
    {
      // TODO: this type is unnecessary, it won't render the LabelValueField component in any case
      type: FormFieldType.labelValue,
      name: 'companyId',
      label: 'Company ID',
      grid: { size: { xs: 12 } },
    },
    {
      type: FormFieldType.fileUpload,
      name: 'licenseFile',
      label: 'Upload Company License',
      roles: [UserRole.administrator],
      grid: { size: { xs: 12 } },
      rules: {
        required: { value: true, message: 'Company License is required' },
      },
    },
  ],
  actions: [
    {
      actionType: FormActionType.loadingButton,
      label: 'Next',
      name: FormActionName.submit,
      loadingPosition: 'end',
      endIcon: IconType.next,
      type: 'submit',
      roles: [UserRole.administrator],
      'aria-label': 'Upload Company License Button',
    },
  ],
};

export const DELETE_COMPANY_DETAILS_FORM_SCHEMA: FormProps<void> = {
  module: Module.deleteCompany,
  subModule: SubModule.companyDetails,
  title: 'Delete Company',
  fields: [],
  actions: [
    {
      actionType: FormActionType.loadingButton,
      label: 'Delete Company',
      name: FormActionName.submit,
      loadingPosition: 'end',
      endIcon: IconType.remove,
      color: 'error',
      type: 'submit',
      roles: [UserRole.administrator],
      'aria-label': 'Delete Company Button',
    },
  ],
};

export const COMPANY_VIEW_DETAILS_SCHEMA: ViewDetailProps<Company> = {
  module: Module.companyManagement,
  subModule: SubModule.companyViewDetails,
  title: 'Company Details',
  fields: [
    {
      name: 'basicInfo',
      label: 'Basic Information',
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: COMPANY_FIELDS.name.field,
      label: COMPANY_FIELDS.name.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: COMPANY_FIELDS.countryName!.field,
      label: COMPANY_FIELDS.countryName!.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: COMPANY_FIELDS.id!.field,
      label: COMPANY_FIELDS.id!.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12 } },
      renderDetailField: (company) =>
        renderCopyableField({
          module: COMPANY_VIEW_DETAILS_SCHEMA.module,
          subModule: COMPANY_VIEW_DETAILS_SCHEMA.subModule,
          text: String(company?.id),
        }),
    },
  ],
  actions: [
    {
      actionType: ViewDetailActionType.button,
      label: 'Edit',
      name: ViewDetailActionName.edit,
      roles: [UserRole.administrator],
      color: 'primary',
      variant: 'contained',
      'aria-label': 'Edit Company Button',
    },
  ],
};

export const COMPANY_LICENSE_VIEW_DETAILS_SCHEMA: ViewDetailProps<CompanyLicense> = {
  title: 'Company License Details',
  module: Module.companyManagement,
  subModule: SubModule.companyLicenseViewDetails,
  fields: [
    {
      name: COMPANY_LICENSE_FIELDS.terms.field,
      label: COMPANY_LICENSE_FIELDS.terms.name,
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.longName.field}`,
      label: COMPANY_LICENSE_FIELDS.terms.licensee.longName.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.field}.${COMPANY_LICENSE_FIELDS.terms.licensee.shortName.field}`,
      label: COMPANY_LICENSE_FIELDS.terms.licensee.shortName.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.notBefore.field}`,
      label: COMPANY_LICENSE_FIELDS.terms.notBefore.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.terms.field}.${COMPANY_LICENSE_FIELDS.terms.notAfter.field}`,
      label: COMPANY_LICENSE_FIELDS.terms.notAfter.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 6 } },
    },
    {
      name: COMPANY_LICENSE_FIELDS.entitlements.field,
      label: COMPANY_LICENSE_FIELDS.entitlements.name,
      type: ViewDetailType.section,
      grid: { size: { xs: 12 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumBranchCount.field}`,
      label: COMPANY_LICENSE_FIELDS.entitlements.maximumBranchCount.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 4 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumEmployeeCount.field}`,
      label: COMPANY_LICENSE_FIELDS.entitlements.maximumEmployeeCount.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 4 } },
    },
    {
      name: `${COMPANY_LICENSE_FIELDS.entitlements.field}.${COMPANY_LICENSE_FIELDS.entitlements.maximumDepartmentCount.field}`,
      label: COMPANY_LICENSE_FIELDS.entitlements.maximumDepartmentCount.name,
      type: ViewDetailType.labelValue,
      grid: { size: { xs: 12, md: 4 } },
    },
  ],
};

export const COMPANY_DETAILS_FORM_DEFAULT_VALUES: Company = {
  name: '',
  countryCode: '',
};
