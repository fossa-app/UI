import * as React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { useFormContext } from './FormContext';

// TODO: consider passing actions buttons as a config
const FormActions: React.FC<
  React.PropsWithChildren<{
    generalValidationMessage?: string;
  }>
> = ({ generalValidationMessage, children }) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>{children}</Box>
    </Box>
  );
};

export default FormActions;
