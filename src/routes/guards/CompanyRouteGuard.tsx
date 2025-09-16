import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectCompany } from 'store/features';
import { ROUTES } from 'shared/constants';

const CompanyRouteGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { fetchStatus } = useAppSelector(selectCompany);

  if (fetchStatus === 'failed') {
    return <Navigate to={ROUTES.flows.path} replace />;
  }

  return children;
};

export default CompanyRouteGuard;
