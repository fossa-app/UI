import { User } from 'oidc-client-ts';
import { AppUser, DraftEmployee, Employee, UserProfile } from 'shared/types';

export const mapUser = (user: User): AppUser => {
  const { toStorageString, ...rest } = user;

  return rest;
};

export const mapUserProfileToEmployeeDetails = (
  userProfile?: UserProfile
): Pick<
  Employee,
  'firstName' | 'lastName' | 'fullName' | 'assignedBranchId' | 'assignedDepartmentId' | 'reportsToId' | 'jobTitle' | 'picture'
> => ({
  firstName: userProfile?.given_name ?? '',
  lastName: userProfile?.family_name ?? '',
  fullName: userProfile?.name ?? '',
  assignedBranchId: null,
  assignedDepartmentId: null,
  reportsToId: null,
  jobTitle: '',
  picture: userProfile?.picture,
});

export const mapUserProfileToDraftEmployee = (userProfile?: UserProfile): DraftEmployee | undefined => {
  if (!userProfile) {
    return;
  }

  return {
    ...mapUserProfileToEmployeeDetails(userProfile),
    isDraft: true,
  };
};
