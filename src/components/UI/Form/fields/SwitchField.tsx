import * as React from 'react';
import { FieldError, useFormContext, useWatch } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import { getNestedValue } from 'shared/helpers';
import { SwitchFieldProps } from '../form.model';

const SwitchField: React.FC<SwitchFieldProps> = ({ module, subModule, name, label, ...props }) => {
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useFormContext();

  const error = getNestedValue(errors, name) as FieldError;
  const checked = useWatch({ control, name });

  const handleClick = () => {
    setValue(name, !checked);
  };

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Switch
            data-cy={`${module}-${subModule}-form-field-${name}`}
            checked={!!checked}
            {...register(name, { ...props.rules })}
            {...props}
            onClick={handleClick}
          />
        }
        label={label}
      />
      {error && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {error?.message as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SwitchField;
