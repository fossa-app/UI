import * as React from 'react';
import { Module, SubModule } from 'shared/models';

const PageContext = React.createContext<{ module: Module; subModule: SubModule } | undefined>(undefined);

export const usePageContext = () => {
  const context = React.useContext(PageContext);

  if (!context) {
    throw new Error('usePageContext must be used within a Page component');
  }

  return context;
};

export default PageContext;
