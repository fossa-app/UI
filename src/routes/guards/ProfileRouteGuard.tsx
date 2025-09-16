import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectProfile } from 'store/features';
import { ROUTES } from 'shared/constants';

const ProfileRouteGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { item: profile, fetchStatus } = useAppSelector(selectProfile);

  if (fetchStatus === 'failed' || profile?.isDraft) {
    return <Navigate to={ROUTES.flows.path} replace />;
  }

  return children;
};

export default ProfileRouteGuard;
