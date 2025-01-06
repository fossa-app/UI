import { User } from 'oidc-client-ts';
import { AppUser, EmployeeDTO, UserProfile } from 'shared/models';

export const mapUser = (user: User): AppUser => {
  const { toStorageString, ...rest } = user;

  return rest;
};

export const mapUserProfileToEmployee = (userProfile?: UserProfile): EmployeeDTO | undefined => {
  if (!userProfile) {
    return;
  }

  return {
    firstName: userProfile.given_name!,
    lastName: userProfile.family_name!,
    fullName: userProfile.name!,
  };
};
