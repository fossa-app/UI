import React from 'react';
import { FieldError, useFormContext as reactHookFormContext, Controller, ControllerRenderProps, FieldValues, get } from 'react-hook-form';
import { debounce } from '@mui/material/utils';
import Autocomplete, { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { APP_CONFIG } from 'shared/constants';
import { AutocompleteFieldProps, FieldOption } from '../form.model';
import { useFormContext } from '../FormContext';

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({ label, name, options, loading, onInputChange, onScrollEnd, ...props }) => {
  const {
    formState: { errors },
    control,
  } = reactHookFormContext();
  const { module, subModule } = useFormContext();
  const error = get(errors, name) as FieldError;
  const listboxRef = React.useRef<HTMLElement | null>(null);
  const hasReachedEnd = React.useRef(false);

  const getValue = (field: ControllerRenderProps<FieldValues, string>) => {
    return options.find((option) => option.value === String(field.value)) || null;
  };

  const handleScroll = () => {
    if (!listboxRef.current || !onScrollEnd) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = listboxRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;

    if (isAtBottom && !hasReachedEnd.current && !loading) {
      hasReachedEnd.current = true;
      onScrollEnd();
    }
  };

  const debouncedOnInputChange = debounce(
    (event: React.SyntheticEvent<Element, Event>, newValue: string, reason: AutocompleteInputChangeReason) => {
      onInputChange?.(event, newValue, reason);
    },
    APP_CONFIG.searchDebounceTime
  );

  React.useEffect(() => {
    if (!loading) {
      hasReachedEnd.current = false;
    }
  }, [loading]);

  return (
    <FormControl fullWidth variant="filled" error={!!error}>
      <Controller
        name={name}
        control={control}
        rules={props.rules}
        render={({ field }) => (
          <Autocomplete
            {...field}
            autoComplete
            data-cy={`${module}-${subModule}-form-field-${name}`}
            loading={loading}
            options={options}
            // TODO: add render/getOptionLabel prop method
            // Check for this error in console:
            // MUI: The `getOptionLabel` method of Autocomplete returned object ([object Object]) instead of a string for {"value":"333333333333"}.
            value={getValue(field)}
            isOptionEqualToValue={(option, valueObj) => option.value === valueObj.value}
            onChange={(_, newValue) => {
              field.onChange(newValue ? (newValue as FieldOption).value : '');
            }}
            onInputChange={(event, newValue, reason) => {
              debouncedOnInputChange(event, newValue, reason);
            }}
            slotProps={{
              listbox: {
                role: 'list-box',
                ref: (node: HTMLElement | null) => {
                  if (listboxRef.current && listboxRef.current !== node) {
                    listboxRef.current.removeEventListener('scroll', handleScroll);
                  }

                  listboxRef.current = node;

                  if (node) {
                    node.addEventListener('scroll', handleScroll, { passive: true });
                  }
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                data-cy={`${module}-${subModule}-form-field-${name}-input`}
                label={label}
                variant="filled"
                error={!!error}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              position: 'absolute',
                              right: 64,
                              top: '50%',
                              transform: 'translate(0, -50%)',
                            }}
                          >
                            <CircularProgress size={20} color="inherit" />
                          </Box>
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
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
