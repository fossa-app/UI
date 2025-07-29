import * as React from 'react';
import { useFormContext as reactHookFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import FormHelperText from '@mui/material/FormHelperText';
import { getGeneralErrorMessage } from 'shared/helpers';
import { FormFieldProps } from './form.model';
import Field from './fields';
import { useFormContext } from './FormContext';

type WithFields<T> = {
  fields: FormFieldProps<T>[];
  values?: T;
  children?: never;
};

type WithChildren = {
  children: React.ReactNode;
  fields?: never;
  values?: never;
};

type FormContentProps<T> = WithFields<T> | WithChildren;

const FormContent = <T,>({ fields, values, children }: FormContentProps<T>) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormContent must be used within a Form component using FormContext.');
  }

  const { module, subModule, loading } = context;
  const {
    formState: { errors },
  } = reactHookFormContext();
  const generalErrorMessage = getGeneralErrorMessage<T>(errors, fields);

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, padding: 6, overflowY: 'auto' }}>
      {fields?.length ? (
        <Grid container spacing={4}>
          {fields.map((field) => (
            <Grid key={field.name} {...field.grid}>
              {field.renderField ? field.renderField(values) : <Field<T> key={field.name} {...field} />}
            </Grid>
          ))}
        </Grid>
      ) : (
        children
      )}
      {generalErrorMessage && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-general-error-message`} sx={{ my: 3, fontSize: '1rem' }}>
          {generalErrorMessage}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormContent;
