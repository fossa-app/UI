import React from 'react';
import { useAppSelector } from 'store';
import { selectAppLoading } from 'store/features';
import CircularLoader from 'components/UI/CircularLoader';

const LoaderLayout: React.FC = () => {
  const { loading } = useAppSelector(selectAppLoading);

  if (!loading) {
    return null;
  }

  return <CircularLoader />;
};

export default LoaderLayout;
