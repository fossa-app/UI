import { FusionAuthProviderConfig } from '@fusionauth/react-sdk';

export const FUSION_AUTH_CONFIG: FusionAuthProviderConfig = {
  clientId: '',
  redirectUri: '',
  postLogoutRedirectUri: '',
  serverUrl: 'http://localhost:9011',
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
  scope: 'openid email profile offline_access',
};
