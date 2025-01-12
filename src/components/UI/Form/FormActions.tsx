import * as React from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '../LoadingButton';
import { useFormContext } from './FormContext';

const FormActions: React.FC<{
  actionLoading: boolean;
  actionDisabled?: boolean;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  generalValidationMessage?: string;
}> = ({ actionLoading, actionDisabled = false, actionLabel = 'Save', actionIcon = <SaveIcon />, generalValidationMessage }) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* TODO: need cancel button, move action buttons outside of FormActions */}
        <LoadingButton
          data-cy={`${module}-${subModule}-form-action-button`}
          disabled={actionDisabled}
          type="submit"
          variant="contained"
          loadingPosition="end"
          loading={actionLoading}
          endIcon={actionIcon}
        >
          {actionLabel}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default FormActions;
