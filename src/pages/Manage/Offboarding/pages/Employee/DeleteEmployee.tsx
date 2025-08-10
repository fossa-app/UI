import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { deleteProfile, selectProfile } from 'store/features';
import { DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA.module;
const testSubModule = DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA.subModule;

const DeleteEmployeePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deleteStatus } = useAppSelector(selectProfile);
  const fields = DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA.fields;

  const actions = React.useMemo(() => {
    return DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA.actions.map((action) => {
      switch (action.name) {
        case FormActionName.submit:
          return {
            ...action,
            loading: deleteStatus === 'loading',
          };
        default:
          return action;
      }
    });
  }, [deleteStatus]);

  const handleSubmit = () => {
    dispatch(deleteProfile());
  };

  return (
    <Form<File> module={testModule} subModule={testSubModule} onSubmit={handleSubmit}>
      <Form.Header>{DELETE_EMPLOYEE_DETAILS_FORM_SCHEMA.title}</Form.Header>
      <Form.Content fields={fields} />
      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default DeleteEmployeePage;
