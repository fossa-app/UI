import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { SelectFieldProps } from '../form.model';

const SelectField: React.FC<SelectFieldProps> = ({ module, subModule, label, name, options, ...props }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const value = useWatch({ control, name });
  const isValueAvailable = options.some((option) => option.value === value);
  const fieldValue = !!options?.length && isValueAvailable ? value : '';

  const menuProps = {
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: 240,
        },
      },
    },
  };

  return (
    <FormControl variant="filled" error={!!errors[name]} fullWidth>
      <InputLabel shrink={!!value}>{label}</InputLabel>
      <Select
        data-cy={`${module}-${subModule}-form-field-${name}`}
        value={fieldValue}
        {...register(name, { ...props.rules })}
        {...menuProps}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} data-cy={`${module}-${subModule}-form-field-${name}-option-${option.value}`} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[name] && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-validation`}>
          {errors[name]?.message as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;
