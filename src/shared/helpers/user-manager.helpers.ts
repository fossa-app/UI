import { UserManager, WebStorageStateStore, UserManagerSettings, OidcClientSettings } from 'oidc-client-ts';
import { OIDC_INITIAL_CONFIG } from 'shared/constants';

const userStore = new WebStorageStateStore({
  store: window.localStorage,
  prefix: 'oidc.',
});

let userManager: UserManager | null = null;

export const getUserManager = (settings: OidcClientSettings = OIDC_INITIAL_CONFIG): UserManager => {
  if (!userManager) {
    userManager = new UserManager({
      ...settings,
      userStore,
    });
  }
  return userManager;
};

export const updateUserManager = (settings: UserManagerSettings): void => {
  userManager = new UserManager({
    ...userManager?.settings,
    ...settings,
    userStore,
  });
};
