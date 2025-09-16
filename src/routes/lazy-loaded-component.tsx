import React from 'react';
import AdminRouteGuard from './guards/AdminRouteGuard';
import RouteTitle from 'components/RouteTitle';
import CircularLoader from 'components/UI/CircularLoader';

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
      {/* TODO: create error boundary component */}
      {isAdminRoute ? <AdminRouteGuard>{content}</AdminRouteGuard> : content}
    </React.Suspense>
  );
};
