import React from 'react';
import AdminRouteGuard from './guards/AdminRouteGuard';
import RouteTitle from 'components/RouteTitle';
import CircularLoader from 'components/UI/CircularLoader';
import ErrorBoundary from 'components/ErrorBoundary';

type ImportFunc = () => Promise<{ default: React.ComponentType<object> }>;

interface LazyComponentProps {
  title?: string;
  isAdminRoute?: boolean;
  [key: string]: unknown;
}

export const createLazyComponent = (
  importFunc: ImportFunc,
  { title, isAdminRoute, ...props }: LazyComponentProps = {}
): React.ReactElement => {
  const Component = React.lazy(importFunc);
  const content = (
    <>
      {title && <RouteTitle title={title} />}
      <Component {...props} />
    </>
  );

  return (
    <React.Suspense fallback={<CircularLoader />}>
      <ErrorBoundary>{isAdminRoute ? <AdminRouteGuard>{content}</AdminRouteGuard> : content}</ErrorBoundary>
    </React.Suspense>
  );
};
