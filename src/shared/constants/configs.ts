import { OidcClientSettings } from 'oidc-client-ts';

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
  httpTimeout: 5000,
};

export const MESSAGES = {
  error: {
    general: {
      unAuthorized: 'Session has expired. Please log in again. 😖',
      common: 'An unexpected error occurred. Please try again later. 😖',
      network: 'Network Error 😖',
      permission: `You don't have the necessary permissions. Please reach out to your Company administrator for support. 😖`,
    },
    client: {
      notFound: 'Client not found 😞',
    },
    system: {
      notFound: 'System not found 😞',
    },
    company: {
      notFound: 'Company not found 😞',
    },
    branches: {
      notFound: 'Branch not found 😞',
    },
    employee: {
      notFound: 'Employee not found 😞',
    },
  },
};

export const STEP_KEY = 'step';
