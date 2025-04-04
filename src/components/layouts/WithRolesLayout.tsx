import * as React from 'react';
import { hasAllowedRole } from 'shared/helpers';
import { UserRole } from 'shared/models';

interface WithRolesLayoutProps {
  allowedRoles?: UserRole[];
  userRoles?: UserRole[];
}

const WithRolesLayout: React.FC<React.PropsWithChildren<WithRolesLayoutProps>> = ({ allowedRoles, userRoles, children }) => {
  if (!allowedRoles) {
    return <>{children}</>;
  }

  if (allowedRoles && allowedRoles.length === 0) {
    return null;
  }

  return hasAllowedRole(allowedRoles, userRoles) ? <>{children}</> : null;
};

export default WithRolesLayout;
