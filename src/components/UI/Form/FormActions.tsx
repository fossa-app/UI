import * as React from 'react';
import Box from '@mui/material/Box';
import { useFormContext } from './FormContext';
import { FormActionProps } from './form.model';
import FormAction from './actions';

type WithActions = {
  actions: FormActionProps[];
  children?: never;
};

type WithChildren = {
  children: React.ReactNode;
  actions?: never;
};

type FormActionsProps = WithActions | WithChildren;

const FormActions: React.FC<FormActionsProps> = ({ actions, children }) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormActions must be used within a Form component using FormContext.');
  }

  return (
    <Box sx={{ padding: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
        {actions ? actions.map((action) => <FormAction key={action.name} {...action} />) : children}
      </Box>
    </Box>
  );
};

export default FormActions;
