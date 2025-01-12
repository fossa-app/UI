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
    defaultPagination: { pageNumber: 1, pageSize: 5, search: '', totalItems: undefined } as PaginationParams,
    defaultPageSizeOptions: [5, 10],
  },
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
        createFailed: 'Failed to upload Company license 😞',
      },
    },
    company: {
      notFound: 'Company not found 😞',
      createFailed: 'Failed to create a Company 😞',
      updateFailed: 'Failed to update Company 😞',
    },
    branches: {
      notFound: 'Branch not found 😞',
      createFailed: 'Failed to create a Branch 😞',
      updateFailed: 'Failed to update Branch 😞',
      deleteFailed: 'Failed to delete Branch 😞',
    },
    employee: {
      notFound: 'Employee not found 😞',
      createFailed: 'Failed to create an Employee 😞',
    },
  },
};

export const STEP_KEY = 'step';
