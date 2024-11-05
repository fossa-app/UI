import React from 'react';
import { useAppSelector } from 'store';
import { selectLoading } from 'store/features';
import CircularLoader from 'components/UI/CircularLoader';

const LoaderLayout: React.FC = () => {
  const { loading } = useAppSelector(selectLoading);

  if (!loading) {
    return null;
  }

  return <CircularLoader />;
};

export default LoaderLayout;
