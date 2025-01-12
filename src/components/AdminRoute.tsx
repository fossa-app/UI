import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectIsUserAdmin, selectUser } from 'store/features';
import { ROUTES } from 'shared/constants';

const AdminRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { status } = useAppSelector(selectUser);

  if (status === 'succeeded' && !isUserAdmin) {
    return <Navigate to={ROUTES.company.path} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
