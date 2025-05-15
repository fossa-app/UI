import * as React from 'react';
import { FieldError, get, useFormContext as reactHookFormContext, useWatch } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import { CheckboxFieldProps } from '../form.model';
import { useFormContext } from '../FormContext';

const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label, ...props }) => {
  const {
    register,
    formState: { errors },
    control,
  } = reactHookFormContext();
  const { module, subModule } = useFormContext();
  const error = get(errors, name) as FieldError;
  const checked = useWatch({ control, name });

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            data-cy={`${module}-${subModule}-form-field-${name}`}
            checked={!!checked}
            {...register(name, { ...props.rules })}
            {...props}
          />
        }
        label={label}
      />
      {error && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CheckboxField;
