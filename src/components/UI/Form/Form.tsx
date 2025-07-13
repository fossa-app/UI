import * as React from 'react';
import { FormProvider as ReactHookFormProvider, useForm, DefaultValues, FieldErrors, FieldValues } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import { Item, Module, SubModule } from 'shared/models';
import { deepEqual } from 'shared/helpers';
import { CUSTOM_STYLES } from 'shared/themes';
import LinearLoader from '../LinearLoader';
import FormContext from './FormContext';
import FormHeader from './FormHeader';
import FormContent from './FormContent';
import FormActions from './FormActions';

type FormProps<T extends FieldValues> = React.PropsWithChildren<{
  module: Module;
  subModule: SubModule;
  defaultValues?: DefaultValues<T>;
  values?: T;
  errors?: FieldErrors<T>;
  loading?: boolean;
  onSubmit?: (formValue: T) => void;
  onChange?: (formValue: T) => void;
}>;

const Form = <T extends Item>({
  module,
  subModule,
  defaultValues,
  values,
  errors,
  loading = false,
  onSubmit,
  onChange,
  children,
}: FormProps<T>) => {
  const methods = useForm<T>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues,
    values,
    errors,
  });

  const watchedValues = methods.watch();
  const prevValuesRef = React.useRef<T>();

  React.useEffect(() => {
    if (onChange && !deepEqual(watchedValues, prevValuesRef.current!)) {
      onChange(watchedValues);
      prevValuesRef.current = watchedValues;
    }
  }, [watchedValues, onChange]);

  return (
    <FormContext.Provider value={{ module, subModule }}>
      <ReactHookFormProvider {...methods}>
        <Paper
          data-cy={`${module}-${subModule}-form`}
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            height: CUSTOM_STYLES.scrollableContentHeight,
          }}
        >
          <form
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, height: '100%' }}
            onSubmit={methods.handleSubmit((data) => {
              onSubmit?.(data as T);
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
