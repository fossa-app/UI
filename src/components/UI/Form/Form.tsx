import * as React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import FormHelperText from '@mui/material/FormHelperText';
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
  actionLoading: boolean;
  actionDisabled?: boolean;
  loading?: boolean;
  values?: T;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  generalValidationMessage?: string;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (formValue: T) => void;
};

const Form = <T extends Item>({
  module,
  subModule,
  fields,
  defaultValues,
  values,
  loading = false,
  actionLoading,
  actionDisabled = false,
  actionLabel = 'Save',
  actionIcon = <SaveIcon />,
  generalValidationMessage,
  onSubmit,
}: FormProps<T>) => {
  const methods = useForm<T>({
    mode: 'onSubmit',
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
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
              {fields.map((field) => (
                <Grid key={field.name} {...field.grid}>
                  <Field key={field.name} {...field} />
                </Grid>
              ))}
            </Grid>
          </Box>
          {/* TODO: either move this to form schemas or create separate components for form header, fields and actions */}
          {generalValidationMessage && (
            <FormHelperText data-cy={`${module}-${subModule}-form-general-validation-message`} error>
              {generalValidationMessage}
            </FormHelperText>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <LoadingButton
              data-cy={`${module}-${subModule}-form-action-button`}
              disabled={actionDisabled}
              type="submit"
              variant="contained"
              loadingPosition="end"
              loading={actionLoading}
              endIcon={actionIcon}
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
