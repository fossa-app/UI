import * as React from 'react';
import AdminRoute from 'components/AdminRoute';
import RouteTitle from 'components/RouteTitle';
import CircularLoader from 'components/UI/CircularLoader';

type ImportFunc = () => Promise<{ default: React.ComponentType<{}> }>;

interface LazyComponentProps {
  title?: string;
  isAdminRoute?: boolean;
}

export const createLazyComponent = (importFunc: ImportFunc, { title, isAdminRoute }: LazyComponentProps = {}): React.ReactElement => {
  const Component = React.lazy(importFunc);

  return (
    <React.Suspense fallback={<CircularLoader />}>
      {/* TODO: create error boundary component */}
      {isAdminRoute ? (
        <AdminRoute>
          {title && <RouteTitle title={title} />}
          <Component />
        </AdminRoute>
      ) : (
        <>
          {title && <RouteTitle title={title} />}
          <Component />
        </>
      )}
    </React.Suspense>
  );
};
