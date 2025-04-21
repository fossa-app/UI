import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectProfile } from 'store/features';
import { ROUTES } from 'shared/constants';

const ProfileRouteGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { data: profile, fetchStatus } = useAppSelector(selectProfile);

  if ((fetchStatus === 'failed' && !profile) || profile?.isDraft) {
    return <Navigate to={ROUTES.setup.path} replace />;
  }

  return children;
};

export default ProfileRouteGuard;
