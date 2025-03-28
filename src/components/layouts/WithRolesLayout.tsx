import * as React from 'react';
import { UserRole } from 'shared/models';

interface WithRolesLayoutProps {
  allowedRoles?: UserRole[];
  userRoles?: UserRole[];
  children: React.ReactNode;
}

const WithRolesLayout: React.FC<WithRolesLayoutProps> = ({ allowedRoles, userRoles, children }) => {
  if (!allowedRoles) {
    return <>{children}</>;
  }

  if (allowedRoles && allowedRoles.length === 0) {
    return null;
  }

  const hasAllowedRole = userRoles?.some((role) => allowedRoles.includes(role));

  return hasAllowedRole ? <>{children}</> : null;
};

export default WithRolesLayout;
