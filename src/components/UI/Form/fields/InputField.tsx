import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { InputFieldProps } from '../form.model';

const InputField: React.FC<InputFieldProps> = ({ module, subModule, name, ...props }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const value = useWatch({ control, name });

  return (
    <FormControl fullWidth>
      <TextField
        data-cy={`${module}-${subModule}-form-field-${name}`}
        variant="filled"
        error={!!errors[name]}
        slotProps={{
          inputLabel: { shrink: !!value },
        }}
        {...register(name, { ...props.rules })}
        {...props}
      />
      {errors[name] && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {errors[name]?.message as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default InputField;
