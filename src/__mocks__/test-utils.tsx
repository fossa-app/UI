import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SearchProvider } from 'components/Search';

export const MockRouterWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SearchProvider>{children}</SearchProvider>
    </MemoryRouter>
  );
};
