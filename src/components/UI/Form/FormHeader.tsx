import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useFormContext } from './FormContext';

const FormHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormHeader must be used within a Form component using FormContext.');
  }

  const { module, subModule } = useFormContext();

  return (
    <AppBar position="static" component="header" color="primary" data-cy={`${module}-${subModule}-form-header`}>
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
};

export default FormHeader;
