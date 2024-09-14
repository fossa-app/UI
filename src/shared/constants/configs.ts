import { FusionAuthProviderConfig } from '@fusionauth/react-sdk';

export const FUSION_AUTH_CONFIGS: FusionAuthProviderConfig = {
  clientId: '',
  redirectUri: '',
  postLogoutRedirectUri: '',
  serverUrl: 'http://localhost:9011',
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
  scope: 'openid email profile',
  onRedirect: (state?: string) => {
    console.log(`Redirect happened with state value: ${state}`);
  },
};
