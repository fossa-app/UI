import * as React from 'react';
import Paper from '@mui/material/Paper';
import { FormProvider as ReactHookFormProvider, useForm, DefaultValues } from 'react-hook-form';
import { Item, Module, SubModule } from 'shared/models';
import LinearLoader from '../LinearLoader';
import FormContext from './FormContext';
import FormHeader from './FormHeader';
import FormContent from './FormContent';
import FormActions from './FormActions';

type FormProps<TDisplay, TSubmit> = React.PropsWithChildren<{
  module: Module;
  subModule: SubModule;
  defaultValues: DefaultValues<TDisplay>;
  values?: TDisplay;
  loading?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (formValue: TSubmit) => void;
}>;

const Form = <TDisplay extends Item, TSubmit extends Item>({
  module,
  subModule,
  defaultValues,
  values,
  loading = false,
  onSubmit,
  children,
}: FormProps<TDisplay, TSubmit>) => {
  const methods = useForm<TDisplay>({
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
              onSubmit(data as unknown as TSubmit);
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
