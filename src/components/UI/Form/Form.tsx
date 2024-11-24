import * as React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import { FormProvider, useForm, DefaultValues } from 'react-hook-form';
import { Item, Module, SubModule } from 'shared/models';
import LinearLoader from '../LinearLoader';
import { FieldProps } from './form.model';
import Field from './fields';

type FormProps<T> = {
  module: Module;
  subModule: SubModule;
  fields: FieldProps[];
  defaultValues: DefaultValues<T>;
  loading: boolean;
  actionLoading: boolean;
  values?: T;
  actionLabel?: string;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (formValue: T) => void;
};

const Form = <T extends Item>({
  module,
  subModule,
  fields,
  defaultValues,
  values,
  loading,
  actionLoading,
  actionLabel = 'Save',
  onSubmit,
}: FormProps<T>) => {
  const methods = useForm<T>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
    values,
  });

  return (
    <FormProvider {...methods}>
      <Paper
        data-cy={`${module}-${subModule}-form`}
        elevation={3}
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 6, position: 'relative' }}
      >
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }} onSubmit={methods.handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ flexGrow: 1 }}>
            {fields.map((field) => (
              <Grid key={field.name} {...field.grid}>
                <Field key={field.name} {...field} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <LoadingButton
              data-cy={`${module}-${subModule}-form-action-button`}
              type="submit"
              variant="contained"
              loadingPosition="end"
              loading={actionLoading}
              endIcon={<SaveIcon />}
            >
              {actionLabel}
            </LoadingButton>
          </Box>
        </form>
        <LinearLoader open={loading} />
      </Paper>
    </FormProvider>
  );
};

export default Form;
