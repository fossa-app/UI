import * as React from 'react';
import { FieldError, useFormContext, useWatch } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getNestedValue } from 'shared/helpers';
import { InputFieldProps } from '../form.model';

const InputField: React.FC<InputFieldProps> = ({ module, subModule, name, ...props }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const value = useWatch({ control, name });
  const error = getNestedValue(errors, name) as FieldError;

  return (
    <FormControl fullWidth>
      <TextField
        data-cy={`${module}-${subModule}-form-field-${name}`}
        variant="filled"
        error={!!error}
        slotProps={{
          inputLabel: { shrink: !!value },
        }}
        {...register(name, { ...props.rules })}
        {...props}
      />
      {error && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default InputField;
