import { OidcClientSettings } from 'oidc-client-ts';
import { PaginationParams } from 'shared/models';

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
  },
  searchDebounceTime: 300,
  emptyValue: '-',
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
    },
    branches: {
      notFound: 'Branch not found 😞',
      create: 'Failed to create a Branch 😞',
      update: 'Failed to update the Branch 😞',
      delete: 'Failed to delete the Branch 😞',
    },
    employee: {
      notFound: 'Employee not found 😞',
      create: 'Failed to create an Employee 😞',
      updateEmployee: 'Failed to update the Employee 😞',
      updateProfile: 'Failed to update the Profile 😞',
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
    branches: {
      create: 'Branch has been successfully created 😊',
      update: 'Branch has been successfully updated 😊',
      delete: 'Branch has been successfully deleted 😊',
    },
    employee: {
      create: 'Employee has been successfully created 😊',
      updateEmployee: 'Employee has been successfully updated 😊',
      updateProfile: 'Profile has been successfully updated 😊',
      deleteProfile: 'Profile has been successfully deleted 😊',
    },
  },
};

export const STEP_KEY = 'step';
