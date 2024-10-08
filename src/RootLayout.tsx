import * as React from 'react';
import AxiosInterceptor from './AxiosInterceptor';
import ClientLoader from './ClientLoader';

const RootLayout: React.FC = () => {
  return (
    <AxiosInterceptor>
      <ClientLoader />
    </AxiosInterceptor>
  );
};

export default RootLayout;
