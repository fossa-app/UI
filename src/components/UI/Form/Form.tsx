import * as React from 'react';
import Paper from '@mui/material/Paper';
import { FormProvider as ReactHookFormProvider, useForm, DefaultValues } from 'react-hook-form';
import { Item, Module, SubModule } from 'shared/models';
import LinearLoader from '../LinearLoader';
import FormContext from './FormContext';
import FormHeader from './FormHeader';
import FormContent from './FormContent';
import FormActions from './FormActions';

type FormProps<T> = React.PropsWithChildren<{
  module: Module;
  subModule: SubModule;
  defaultValues: DefaultValues<T>;
  values?: T;
  loading?: boolean;
  onSubmit: (formValue: T) => void;
}>;

const Form = <T extends Item>({ module, subModule, defaultValues, values, loading = false, onSubmit, children }: FormProps<T>) => {
  const methods = useForm<T>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues,
    values,
  });

  return (
    <FormContext.Provider value={{ module, subModule }}>
      <ReactHookFormProvider {...methods}>
        <Paper
          data-cy={`${module}-${subModule}-form`}
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative' }}
        >
          <form
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            onSubmit={methods.handleSubmit((data) => {
              onSubmit(data as T);
            })}
          >
            {children}
          </form>
          <LinearLoader open={loading} />
        </Paper>
      </ReactHookFormProvider>
    </FormContext.Provider>
  );
};

Form.Header = FormHeader;
Form.Content = FormContent;
Form.Actions = FormActions;

export default Form;
