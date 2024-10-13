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
  errorMessages: {
    unAuthorized: 'Session has expired. Please log in again.',
    general: 'An unexpected error occurred. Please try again later.',
    network: 'Network Error',
    permission: `You don't have the necessary permissions. Please reach out to your Company administrator for support.`,
  },
};
