import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectCompanySettings } from 'store/features';
import { ROUTES } from 'shared/constants';

const CompanySettingsRouteGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { fetchStatus } = useAppSelector(selectCompanySettings);

  if (fetchStatus === 'failed') {
    return <Navigate to={ROUTES.flows.path} replace />;
  }

  return children;
};

export default CompanySettingsRouteGuard;
