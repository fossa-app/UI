import * as React from 'react';
import { Controller, FieldError, get, useFormContext as reactHookFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import ColorSchemeSelector from 'components/UI/ColorSchemeSelector';
import { useFormContext } from '../FormContext';
import { ColorSchemeFieldProps } from '../form.model';

const ColorSchemeField: React.FC<ColorSchemeFieldProps> = ({ name, mode, rules }) => {
  const {
    control,
    formState: { errors },
  } = reactHookFormContext();

  const { module, subModule } = useFormContext();
  const error = get(errors, name) as FieldError;

  return (
    <FormControl fullWidth error={!!error}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <ColorSchemeSelector module={module} subModule={subModule} selectedScheme={field.value} mode={mode} onChange={field.onChange} />
        )}
      />
      {error && <FormHelperText data-cy={`${module}-${subModule}-form-field-${name}-validation`}>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default ColorSchemeField;
