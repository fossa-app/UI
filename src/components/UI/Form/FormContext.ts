import * as React from 'react';
import { Module, SubModule } from 'shared/models';

const FormContext = React.createContext<{ module: Module; subModule: SubModule } | undefined>(undefined);

// TODO: change this name to not conflict with the react-hook-form interface
export const useFormContext = () => {
  const context = React.useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }

  return context;
};

export default FormContext;
