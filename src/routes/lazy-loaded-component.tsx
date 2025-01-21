import * as React from 'react';
import AdminRouteGuard from './guards/AdminRouteGuard';
import RouteTitle from 'components/RouteTitle';
import CircularLoader from 'components/UI/CircularLoader';

type ImportFunc = () => Promise<{ default: React.ComponentType<object> }>;

interface LazyComponentProps {
  title?: string;
  isAdminRoute?: boolean;
}

export const createLazyComponent = (importFunc: ImportFunc, { title, isAdminRoute }: LazyComponentProps = {}): React.ReactElement => {
  const Component = React.lazy(importFunc);
  const content = (
    <>
      {title && <RouteTitle title={title} />}
      <Component />
    </>
  );

  return (
    <React.Suspense fallback={<CircularLoader />}>
      {/* TODO: create error boundary component */}
      {isAdminRoute ? <AdminRouteGuard>{content}</AdminRouteGuard> : content}
    </React.Suspense>
  );
};
