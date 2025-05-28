import * as React from 'react';
import { useFormContext as reactHookFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import FormHelperText from '@mui/material/FormHelperText';
import { getGeneralErrorMessage } from 'shared/helpers';
import { FormFieldProps } from './form.model';
import Field from './fields';
import { useFormContext } from './FormContext';

type FormContentProps<T> = {
  fields: FormFieldProps<T>[];
  values?: T;
};

const FormContent = <T,>({ fields, values }: FormContentProps<T>) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormContent must be used within a Form component using FormContext.');
  }

  const { module, subModule } = context;
  const {
    formState: { errors },
  } = reactHookFormContext();
  const generalErrorMessage = getGeneralErrorMessage<T>(errors, fields);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, padding: 6, overflowY: 'auto' }}>
      <Grid container spacing={4}>
        {fields.map((field) => (
          <Grid key={field.name} {...field.grid}>
            {field.renderField ? field.renderField(values) : <Field<T> key={field.name} {...field} />}
          </Grid>
        ))}
      </Grid>
      {generalErrorMessage && (
        <FormHelperText error data-cy={`${module}-${subModule}-form-general-error-message`} sx={{ my: 3, fontSize: '1rem' }}>
          {generalErrorMessage}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormContent;
