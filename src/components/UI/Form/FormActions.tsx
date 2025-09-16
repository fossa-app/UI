import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
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

type FormActionsProps = (WithActions | WithChildren) & BoxProps;

const FormActions: React.FC<FormActionsProps> = ({ actions, children, ...props }) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormActions must be used within a Form component using FormContext.');
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 4, padding: { xs: 3, sm: 6 }, ...props.sx }}>
      {actions ? actions.map((action) => <FormAction key={action.name} {...action} />) : children}
    </Box>
  );
};

export default FormActions;
