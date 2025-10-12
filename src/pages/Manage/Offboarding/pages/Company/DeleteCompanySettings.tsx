import React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompanySettings, selectIsUserAdmin, selectUserRoles } from 'store/features';
import { deleteCompanySettings } from 'store/thunks';
import { deepCopyObject, hasAllowedRole } from 'shared/helpers';
import { DELETE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA, USER_PERMISSION_GENERAL_ERROR } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = DELETE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.module;
const testSubModule = DELETE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.subModule;

const DeleteCompanySettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { fetchError: error, deleteStatus } = useAppSelector(selectCompanySettings);
  const fields = DELETE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.fields;
  const errors = isUserAdmin ? deepCopyObject(error?.errors as FieldErrors<FieldValues>) : USER_PERMISSION_GENERAL_ERROR;

  const actions = DELETE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.actions.map((action) => {
    switch (action.name) {
      case FormActionName.submit:
        return {
          ...action,
          disabled: !hasAllowedRole(action.roles, userRoles),
          loading: deleteStatus === 'loading',
        };
      default:
        return action;
    }
  });

  const handleSubmit = () => {
    dispatch(deleteCompanySettings());
  };

  return (
    <Form module={testModule} subModule={testSubModule} errors={errors} onSubmit={handleSubmit}>
      <Form.Header>{DELETE_COMPANY_SETTINGS_DETAILS_FORM_SCHEMA.title}</Form.Header>
      <Form.Content fields={fields} />
      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default DeleteCompanySettingsPage;
