import { FusionAuthProviderConfig } from '@fusionauth/react-sdk';

export const FUSION_AUTH_CONFIGS: FusionAuthProviderConfig = {
  clientId: '',
  redirectUri: 'http://we.dev.localtest.me:4211',
  postLogoutRedirectUri: 'http://we.dev.localtest.me:4211/login',
  serverUrl: 'http://localhost:9011',
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
  scope: 'openid email profile',
  onRedirect: (state?: string) => {
    console.log(`Redirect happened with state value: ${state}`);
  },
};
