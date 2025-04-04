import * as React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { useFormContext } from './FormContext';
import { FormActionProps } from './form.model';
import FormAction from './actions';

type FormActionsProps = {
  actions?: FormActionProps[];
  generalValidationMessage?: string;
  children?: React.ReactNode;
};

const FormActions: React.FC<FormActionsProps> = ({ actions, generalValidationMessage, children }) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormActions must be used within a Form component using FormContext.');
  }

  if (actions?.length && children) {
    throw new Error('FormActions cannot accept both "actions" and "children". Provide only one.');
  }

  const { module, subModule } = context;

  return (
    <Box sx={{ padding: 6 }}>
      {generalValidationMessage && (
        <FormHelperText data-cy={`${module}-${subModule}-form-general-validation-message`} error sx={{ my: 2 }}>
          {generalValidationMessage}
        </FormHelperText>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
        {actions ? actions.map((action) => <FormAction key={action.name} {...action} />) : children}
      </Box>
    </Box>
  );
};

export default FormActions;
