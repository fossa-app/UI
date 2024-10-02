import { User } from 'oidc-client-ts';

export type AppUser = Omit<User, 'toStorageString' | 'expires_in' | 'expired' | 'scopes'>;
