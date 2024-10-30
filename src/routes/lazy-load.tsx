import * as React from 'react';
import AdminRoute from 'components/AdminRoute';
import RouteTitle from 'components/RouteTitle';
import Loader from 'components/UI/Loader';

type ImportFunc = () => Promise<{ default: React.ComponentType<any> }>;

export const createLazyComponent = (importFunc: ImportFunc, title?: string, isAdminRoute?: boolean): React.ReactElement => {
  const Component = React.lazy(importFunc);

  return (
    <React.Suspense fallback={<Loader />}>
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
