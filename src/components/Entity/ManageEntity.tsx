import React from 'react';
import { useParams } from 'react-router-dom';
import { DefaultValues, FieldErrors, FieldValues } from 'react-hook-form';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector, RootState, AppDispatch, StateEntity } from 'store';
import { useOnFormSubmitEffect, useSafeNavigateBack, useUnmount } from 'shared/hooks';
import { BaseEntity, EntityInput, ErrorResponse, ErrorResponseDTO, Module, SubModule } from 'shared/types';
import { areEqualBigIds } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName, FormFieldProps, FormProps } from 'components/UI/Form';

type ManageEntityProps<T extends BaseEntity, TDTO extends BaseEntity> = {
  module: Module;
  subModule: SubModule;
  pageTitle: { create: string; edit: string };
  fallbackRoute: string;
  defaultValues: DefaultValues<T>;
  fields: FormFieldProps<T>[];
  formSchema: FormProps<T>;
  formLoading: boolean;
  errors?: FieldErrors<T>;
  extraFormProps?: Partial<React.ComponentProps<typeof Form<T>>>;
  selectEntity: (state: RootState) => StateEntity<T | undefined>;
  resetEntity: () => ReturnType<AppDispatch>;
  resetErrors: () => ReturnType<AppDispatch>;
  resetCatalogFetchStatus: () => ReturnType<AppDispatch>;
  mapDTO: (value: T) => EntityInput<TDTO>;
  createEntityAction: (args: EntityInput<TDTO>) => AsyncThunkAction<void, EntityInput<TDTO>, { rejectValue: ErrorResponse<FieldValues> }>;
  editEntityAction: (
    args: [string, EntityInput<TDTO>]
  ) => AsyncThunkAction<void, [string, EntityInput<TDTO>], { rejectValue: ErrorResponse<FieldValues> }>;
  fetchEntityAction: (params: { id: string }) => AsyncThunkAction<T, unknown, { rejectValue: ErrorResponseDTO }>;
};

const ManageEntity = <T extends BaseEntity, TDTO extends BaseEntity>({
  module,
  subModule,
  pageTitle,
  fallbackRoute,
  defaultValues,
  fields,
  formSchema,
  formLoading,
  errors,
  extraFormProps,
  selectEntity,
  resetEntity,
  resetErrors,
  resetCatalogFetchStatus,
  fetchEntityAction,
  createEntityAction,
  editEntityAction,
  mapDTO,
}: ManageEntityProps<T, TDTO>) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { item: values, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectEntity);
  const safeNavigateBack = useSafeNavigateBack(fallbackRoute);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const hasFetched = React.useRef(false);

  const actions = formSchema.actions.map((action) => {
    switch (action.name) {
      case FormActionName.cancel:
        return { ...action, onClick: safeNavigateBack };
      case FormActionName.submit:
        return { ...action, loading: updateStatus === 'loading' };
      default:
        return action;
    }
  });

  const handleSubmit = (formValue: T) => {
    const dto = mapDTO(formValue);

    if (id) {
      dispatch(editEntityAction([id, dto]));
    } else {
      dispatch(createEntityAction(dto));
    }

    setFormSubmitted(true);
    dispatch(resetErrors());
  };

  const handleSuccess = () => {
    safeNavigateBack();
    dispatch(resetEntity());
    dispatch(resetCatalogFetchStatus());
  };

  React.useEffect(() => {
    const shouldFetch = !hasFetched.current && id && (!values || !areEqualBigIds(values.id, id)) && fetchEntityAction;

    if (shouldFetch) {
      dispatch(fetchEntityAction({ id }));
      hasFetched.current = true;
    }
  }, [id, values, dispatch, fetchEntityAction]);

  React.useEffect(() => {
    if (!id) {
      dispatch(resetEntity());
    }
  }, [id, dispatch, resetEntity]);

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  useUnmount(() => dispatch(resetErrors()));

  return (
    <PageLayout
      withBackButton
      module={module}
      subModule={subModule}
      pageTitle={id ? pageTitle.edit : pageTitle.create}
      fallbackRoute={fallbackRoute}
      displayNotFoundPage={fetchStatus === 'failed' && !values}
    >
      <Form<T>
        module={module}
        subModule={subModule}
        defaultValues={defaultValues}
        values={values}
        errors={errors}
        loading={formLoading}
        onSubmit={handleSubmit}
        {...extraFormProps}
      >
        <Form.Header>{formSchema.title}</Form.Header>
        <Form.Content fields={fields} />
        <Form.Actions actions={actions} />
      </Form>
    </PageLayout>
  );
};

export default ManageEntity;
