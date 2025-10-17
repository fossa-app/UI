import React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, selectIsUserAdmin, selectUserRoles } from 'store/features';
import { deleteCompany } from 'store/thunks';
import { deepCopyObject, hasAllowedRole } from 'shared/helpers';
import { DELETE_COMPANY_DETAILS_FORM_SCHEMA, USER_PERMISSION_GENERAL_ERROR } from 'shared/constants';
import { Company } from 'shared/types';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = DELETE_COMPANY_DETAILS_FORM_SCHEMA.module;
const testSubModule = DELETE_COMPANY_DETAILS_FORM_SCHEMA.subModule;

const CompanyDeletePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { deleteError: error, deleteStatus } = useAppSelector(selectCompany);
  const fields = DELETE_COMPANY_DETAILS_FORM_SCHEMA.fields;
  const errors = isUserAdmin ? deepCopyObject(error?.errors) : USER_PERMISSION_GENERAL_ERROR;

  const actions = DELETE_COMPANY_DETAILS_FORM_SCHEMA.actions.map((action) => {
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
    dispatch(deleteCompany());
  };

  return (
    <Form<Company> module={testModule} subModule={testSubModule} errors={errors} onSubmit={handleSubmit}>
      <Form.Header>{DELETE_COMPANY_DETAILS_FORM_SCHEMA.title}</Form.Header>
      <Form.Content fields={fields} />
      <Form.Actions actions={actions} />
    </Form>
  );
};

export default CompanyDeletePage;
