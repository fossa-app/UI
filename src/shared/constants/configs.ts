import { OidcClientSettings } from 'oidc-client-ts';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { ColorSchemeId, CompanySettings, EntityInput, PaginationParams } from 'shared/models';

export const OIDC_INITIAL_CONFIG: OidcClientSettings = {
  authority: 'http://localhost:9011',
  response_type: 'code',
  scope: 'openid profile email offline_access',
  client_id: '',
  redirect_uri: '',
  post_logout_redirect_uri: '',
};

export const APP_CONFIG = {
  snackbarAutoHideDuration: 10000,
  httpTimeout: 15000,
  table: {
    defaultPagination: { pageNumber: 1, pageSize: 10, search: '', totalItems: undefined } as PaginationParams,
    defaultPageSizeOptions: [10, 20, 50],
    containerWidth: 'calc(100vw - 32px)',
    containerMaxHeight: 'calc(100% - 70px)',
  },
  searchDebounceTime: 400,
  emptyValue: '-',
  containerWidth: 1156,
  scrollableContentHeight: 'calc(100vh - 250px)',
};

export const MESSAGES = {
  error: {
    general: {
      unAuthorized: 'Session has expired. Please log in again. 😞',
      common: 'An unexpected error occurred. Please try again later. 😞',
      network: 'Network Error 😞',
      permission: `You don't have the necessary permissions. Please reach out to your Company administrator for support. 😊`,
    },
    client: {
      notFound: 'Client not found 😞',
    },
    license: {
      system: {
        notFound: 'System license not found 😞',
      },
      company: {
        notFound: 'Company license not found 😞',
        create: 'Failed to upload Company license 😞',
      },
    },
    company: {
      notFound: 'Company not found 😞',
      create: 'Failed to create a Company 😞',
      update: 'Failed to update the Company 😞',
      deleteDependency: 'Unable to delete the Company. It has dependent entities 😞',
      delete: 'Failed to delete the Company 😞',
    },
    companySettings: {
      notFound: 'Company Settings not found 😞',
      create: 'Failed to create a Company Settings 😞',
      update: 'Failed to update the Company Settings 😞',
      delete: 'Failed to delete the Company Settings 😞',
    },
    branches: {
      notFound: 'Branch not found 😞',
      create: 'Failed to create a Branch 😞',
      update: 'Failed to update the Branch 😞',
      delete: 'Failed to delete the Branch 😞',
    },
    departments: {
      notFound: 'Department not found 😞',
      create: 'Failed to create a Department 😞',
      update: 'Failed to update the Department 😞',
      delete: 'Failed to delete the Department 😞',
    },
    employee: {
      notFound: 'Employee not found 😞',
      create: 'Failed to create an Employee 😞',
      updateEmployee: 'Failed to update the Employee 😞',
      updateProfile: 'Failed to update the Profile 😞',
      deleteProfileDependency: 'Unable to delete the Profile. It has dependent entities 😞',
      deleteProfile: 'Failed to delete the Profile 😞',
    },
  },
  success: {
    license: {
      company: {
        create: 'Company License has been successfully uploaded 😊',
      },
    },
    company: {
      create: 'Company has been successfully created 😊',
      update: 'Company has been successfully updated 😊',
      delete: 'Company has been successfully deleted 😊',
    },
    companySettings: {
      create: 'Company Settings has been successfully created 😊',
      update: 'Company Settings has been successfully updated 😊',
      delete: 'Company Settings has been successfully deleted 😊',
    },
    branches: {
      create: 'Branch has been successfully created 😊',
      update: 'Branch has been successfully updated 😊',
      delete: 'Branch has been successfully deleted 😊',
    },
    departments: {
      create: 'Department has been successfully created 😊',
      update: 'Department has been successfully updated 😊',
      delete: 'Department has been successfully deleted 😊',
    },
    employee: {
      create: 'Employee has been successfully created 😊',
      updateEmployee: 'Employee has been successfully updated 😊',
      updateProfile: 'Profile has been successfully updated 😊',
      deleteProfile: 'Profile has been successfully deleted 😊',
    },
  },
};

export const USER_PERMISSION_GENERAL_MESSAGE = {
  '': {
    type: 'pattern',
    message: MESSAGES.error.general.permission,
  },
} as FieldErrors<FieldValues>;

export const STEP_KEY = 'step';

export const COMPANY_SETTINGS_KEY = 'companySettings';

export const DEFAULT_COLOR_SCHEME: ColorSchemeId = 'midnight';

export const DEFAULT_COMPANY_SETTINGS: EntityInput<CompanySettings> = {
  colorSchemeId: DEFAULT_COLOR_SCHEME,
};
