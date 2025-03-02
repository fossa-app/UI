import * as React from 'react';
import { FieldError, useFormContext, Controller, ControllerRenderProps, FieldValues } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { getNestedValue } from 'shared/helpers';
import { AutocompleteFieldProps, FieldOption } from '../form.model';

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({ module, subModule, label, name, options, ...props }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const error = getNestedValue(errors, name) as FieldError;

  const getValue = (field: ControllerRenderProps<FieldValues, string>) => {
    return options.find((option) => option.value === String(field.value)) || null;
  };

  return (
    <FormControl fullWidth variant="filled" error={!!error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            autoComplete
            data-cy={`${module}-${subModule}-form-field-${name}`}
            options={options}
            // TODO: add render/getOptionLabel prop method
            value={getValue(field)}
            isOptionEqualToValue={(option, valueObj) => option.value === valueObj.value}
            onChange={(_, newValue) => {
              // TODO: check a redundant change on option selection
              // First fires the field change in the component
              field.onChange(newValue ? (newValue as FieldOption).value : '');
            }}
            // TODO: add debounce time
            renderInput={(params) => (
              <TextField
                {...params}
                data-cy={`${module}-${subModule}-form-field-${name}-input`}
                label={label}
                variant="filled"
                error={!!error}
              />
            )}
            renderOption={(props, option) => (
              <Typography {...props} key={option.value} data-cy={`${module}-${subModule}-form-field-${name}-option-${option.value}`}>
                {option.label}
              </Typography>
            )}
            {...props}
          />
        )}
      />
      {error && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default AutocompleteField;
