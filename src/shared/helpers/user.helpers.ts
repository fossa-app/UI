import { User } from 'oidc-client-ts';
import { AppUser, Employee, UserProfile } from 'shared/models';

export const mapUser = (user: User): AppUser => {
  const { toStorageString, ...rest } = user;

  return rest;
};

export const mapUserProfileToEmployee = (userProfile?: UserProfile): Employee | undefined => {
  if (!userProfile) {
    return;
  }

  return {
    firstName: userProfile.given_name!,
    lastName: userProfile.family_name!,
    fullName: userProfile.name!,
    assignedBranchId: null,
    assignedDepartmentId: null,
    picture: userProfile.picture,
  };
};
