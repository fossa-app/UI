import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectEmployee } from 'store/features';
import { ROUTES } from 'shared/constants';

const ProfileRouteGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { data: employee, fetchStatus } = useAppSelector(selectEmployee);

  if (fetchStatus === 'failed' && !employee) {
    return <Navigate to={ROUTES.setup.path} replace />;
  }

  return children;
};

export default ProfileRouteGuard;
