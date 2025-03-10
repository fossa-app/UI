import * as React from 'react';
import { FieldError, useFormContext, Controller, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { debounce } from '@mui/material/utils';
import Autocomplete, { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { APP_CONFIG } from 'shared/constants';
import { getNestedValue } from 'shared/helpers';
import { AutocompleteFieldProps, FieldOption } from '../form.model';

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  module,
  subModule,
  label,
  name,
  options,
  loading,
  onInputChange,
  ...props
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const error = getNestedValue(errors, name) as FieldError;

  const getValue = (field: ControllerRenderProps<FieldValues, string>) => {
    return options.find((option) => option.value === String(field.value)) || null;
  };

  const debouncedOnInputChange = React.useMemo(
    () =>
      debounce((event: React.SyntheticEvent<Element, Event>, newValue: string, reason: AutocompleteInputChangeReason) => {
        onInputChange?.(event, newValue, reason);
      }, APP_CONFIG.searchDebounceTime),
    [onInputChange]
  );

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
            loading={loading}
            options={options}
            // TODO: add render/getOptionLabel prop method
            value={getValue(field)}
            isOptionEqualToValue={(option, valueObj) => option.value === valueObj.value}
            onChange={(_, newValue) => {
              field.onChange(newValue ? (newValue as FieldOption).value : '');
            }}
            onInputChange={(event, newValue, reason) => {
              debouncedOnInputChange(event, newValue, reason);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-cy={`${module}-${subModule}-form-field-${name}-input`}
                label={label}
                variant="filled"
                error={!!error}
              />
            )}
            renderOption={(renderOptionProps, option) => (
              <Typography
                {...renderOptionProps}
                key={option.value}
                data-cy={`${module}-${subModule}-form-field-${name}-option-${option.value}`}
              >
                {option.label}
              </Typography>
            )}
            {...props}
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

export default AutocompleteField;
