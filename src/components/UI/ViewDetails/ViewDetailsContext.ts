import React from 'react';
import { Module, SubModule } from 'shared/types';

const ViewDetailsContext = React.createContext<{ module: Module; subModule: SubModule; loading: boolean } | undefined>(undefined);

export const useViewDetailsContext = () => {
  const context = React.useContext(ViewDetailsContext);

  if (!context) {
    throw new Error('useViewDetailsContext must be used within a ViewDetails component');
  }

  return context;
};

export default ViewDetailsContext;
