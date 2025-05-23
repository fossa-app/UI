import * as React from 'react';
import { Controller, FieldError, get, useFormContext as reactHookFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import { SwitchFieldProps } from '../form.model';
import { useFormContext } from '../FormContext';

const SwitchField: React.FC<SwitchFieldProps> = ({ name, label, ...props }) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = reactHookFormContext();
  const { module, subModule } = useFormContext();
  const error = get(errors, name) as FieldError;

  return (
    <FormControl>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            label={label}
            control={
              <Switch
                data-cy={`${module}-${subModule}-form-field-${name}`}
                checked={!!field.value}
                onClick={() => {
                  setValue(name, !field.value);
                }}
                {...props}
              />
            }
          />
        )}
      />
      {error && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SwitchField;
