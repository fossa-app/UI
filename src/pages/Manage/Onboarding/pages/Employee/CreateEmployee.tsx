import React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectProfile } from 'store/features';
import { createProfile } from 'store/thunks';
import { Employee } from 'shared/models';
import { EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES, CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { deepCopyObject, mapProfileDTO } from 'shared/helpers';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA.module;
const testSubModule = CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA.subModule;

const CreateEmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { item: profile, updateStatus, updateError: error } = useAppSelector(selectProfile);
  const errors = deepCopyObject(error?.errors);

  const actions = CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA.actions.map((action) =>
    action.name === FormActionName.submit ? { ...action, loading: updateStatus === 'loading' } : action
  );

  const handleSubmit = (formValue: Employee) => {
    const submitData = mapProfileDTO(formValue);

    dispatch(createProfile(submitData));
  };

  return (
    <Form<Employee>
      module={testModule}
      subModule={testSubModule}
      defaultValues={EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES}
      values={profile}
      errors={errors}
      onSubmit={handleSubmit}
    >
      <Form.Header>{CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA.title}</Form.Header>
      <Form.Content fields={CREATE_EMPLOYEE_DETAILS_FORM_SCHEMA.fields} />
      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default CreateEmployeePage;
