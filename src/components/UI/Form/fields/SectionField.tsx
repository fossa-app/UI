import * as React from 'react';
import { FieldError, get, useFormContext } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import { SectionFieldProps } from '../form.model';

const SectionField: React.FC<SectionFieldProps> = ({ module, subModule, name, label, ...props }) => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name) as FieldError;

  return (
    <>
      <Typography
        data-cy={`${module}-${subModule}-form-section-field-${name}`}
        variant="h6"
        color="textSecondary"
        sx={{ fontWeight: 500 }}
        {...props}
      >
        {label}
      </Typography>
      {error && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-section-field-${name}-validation`}>
          {error.message}
        </FormHelperText>
      )}
    </>
  );
};

export default SectionField;
