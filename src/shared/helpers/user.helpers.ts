import { User } from 'oidc-client-ts';
import { AppUser } from 'shared/models';

export const mapUser = (user: User): AppUser => {
  // eslint-disable-next-line no-unused-vars
  const { toStorageString, ...rest } = user;

  return rest;
};
