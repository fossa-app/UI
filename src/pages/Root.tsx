import * as React from 'react';
import AxiosInterceptor from '../AxiosInterceptor';
import ClientLoader from '../ClientLoader';

const RootPage: React.FC = () => {
  return (
    <AxiosInterceptor>
      <ClientLoader />
    </AxiosInterceptor>
  );
};

export default RootPage;
