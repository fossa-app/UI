import { OidcClientSettings } from 'oidc-client-ts';

export const OIDC_INITIAL_CONFIG: OidcClientSettings = {
  authority: 'http://localhost:9011',
  response_type: 'code',
  scope: 'openid profile email offline_access',
  client_id: '',
  redirect_uri: '',
  post_logout_redirect_uri: '',
};
