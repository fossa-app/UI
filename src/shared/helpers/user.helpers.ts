import { User } from 'oidc-client-ts';

// TODO: map all fields
export const mapUser = (user: User) => {
  return {
    profile: user.profile,
    access_token: user.access_token,
  };
};
