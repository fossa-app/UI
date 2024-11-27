import { User } from 'oidc-client-ts';

/* eslint-disable no-unused-vars */

export enum UserRole {
  administrator = 'administrator',
}

export type AppUser = Omit<User, 'toStorageString' | 'expires_in' | 'expired' | 'scopes'> & { roles?: UserRole[] };
