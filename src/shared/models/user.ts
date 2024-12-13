import { User } from 'oidc-client-ts';

export enum UserRole {
  administrator = 'administrator',
}

export type AppUser = Omit<User, 'toStorageString' | 'expires_in' | 'expired' | 'scopes'> & { roles?: UserRole[] };
export type UserProfile = AppUser['profile'];
