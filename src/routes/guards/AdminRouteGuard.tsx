import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectIsUserAdmin, selectUser } from 'store/features';
import { ROUTES } from 'shared/constants';

const AdminRouteGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { fetchStatus } = useAppSelector(selectUser);

  if (fetchStatus === 'succeeded' && !isUserAdmin) {
    return <Navigate to={ROUTES.company.path} replace />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
