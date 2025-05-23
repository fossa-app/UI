import { UserRole } from 'shared/models';

export const hasAllowedRole = (allowedRoles?: UserRole[], userRoles?: UserRole[]): boolean => {
  if (!allowedRoles?.length || !userRoles?.length) {
    return true;
  }

  return userRoles.some((role) => allowedRoles.includes(role));
};
