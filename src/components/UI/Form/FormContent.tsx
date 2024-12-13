import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { FieldProps } from './form.model';
import Field from './fields';
import { useFormContext } from './FormContext';

const FormContent: React.FC<{ fields: FieldProps[] }> = ({ fields }) => {
  const context = useFormContext();

  if (!context) {
    throw new Error('FormContent must be used within a Form component using FormContext.');
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 6 }}>
      <Grid container spacing={5}>
        {fields.map((field) => (
          <Grid key={field.name} {...field.grid}>
            <Field key={field.name} {...field} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FormContent;
