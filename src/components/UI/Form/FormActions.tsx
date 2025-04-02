import * as React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { useFormContext } from './FormContext';
import { ActionProps } from './form.model';
import Action from './actions';

type FormActionsProps = {
  actions: ActionProps[];
  generalValidationMessage?: string;
};

const FormActions: React.FC<FormActionsProps> = ({ actions, generalValidationMessage }) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormActions must be used within a Form component using FormContext.');
  }

  const { module, subModule } = useFormContext();

  return (
    <Box sx={{ padding: 6 }}>
      {generalValidationMessage && (
        <FormHelperText data-cy={`${module}-${subModule}-form-general-validation-message`} error sx={{ my: 2 }}>
          {generalValidationMessage}
        </FormHelperText>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
        {actions.map((action) => (
          <Action key={action.name} {...action} />
        ))}
      </Box>
    </Box>
  );
};

export default FormActions;
