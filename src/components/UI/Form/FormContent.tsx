import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
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

  return (
    <Box sx={{ flexGrow: 1, padding: 6, overflowY: 'auto' }}>
      <Grid container spacing={4}>
        {fields.map((field) => (
          <Grid key={field.name} {...field.grid}>
            {field.renderField ? field.renderField(values) : <Field<T> key={field.name} {...field} />}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FormContent;
