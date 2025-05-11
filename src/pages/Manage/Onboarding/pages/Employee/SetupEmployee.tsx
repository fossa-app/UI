import * as React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { createProfile, selectUser, selectProfile } from 'store/features';
import { Employee } from 'shared/models';
import { EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES, EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { deepCopyObject, mapProfileDTO, mapUserProfileToEmployee } from 'shared/helpers';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA.module;
const testSubModule = EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA.subModule;

const SetupEmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector(selectUser);
  const { error, updateStatus } = useAppSelector(selectProfile);

  const employeeData = React.useMemo(() => {
    return mapUserProfileToEmployee(user?.profile);
  }, [user?.profile]);

  const actions = React.useMemo(
    () =>
      EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA.actions.map((action) =>
        action.name === FormActionName.submit ? { ...action, loading: updateStatus === 'loading' } : action
      ),
    [updateStatus]
  );

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const handleSubmit = (formValue: Employee) => {
    const submitData = mapProfileDTO(formValue);

    dispatch(createProfile(submitData));
  };

  return (
    <Form<Employee>
      module={testModule}
      subModule={testSubModule}
      defaultValues={EMPLOYEE_DETAILS_FORM_DEFAULT_VALUES}
      values={employeeData}
      errors={errors}
      onSubmit={handleSubmit}
    >
      <Form.Header>{EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA.title}</Form.Header>

      <Form.Content fields={EMPLOYEE_SETUP_DETAILS_FORM_SCHEMA.fields} />

      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default SetupEmployeePage;
