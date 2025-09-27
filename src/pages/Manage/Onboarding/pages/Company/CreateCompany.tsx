import React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, selectIsUserAdmin, selectUserRoles, selectSystemCountries } from 'store/features';
import { createCompany } from 'store/thunks';
import { Company, CompanyDTO } from 'shared/models';
import { deepCopyObject, hasAllowedRole, mapCountriesToFieldOptions, mapDisabledFields } from 'shared/helpers';
import { COMPANY_DETAILS_FORM_DEFAULT_VALUES, CREATE_COMPANY_DETAILS_FORM_SCHEMA, USER_PERMISSION_GENERAL_MESSAGE } from 'shared/constants';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = CREATE_COMPANY_DETAILS_FORM_SCHEMA.module;
const testSubModule = CREATE_COMPANY_DETAILS_FORM_SCHEMA.subModule;

const CreateCompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const countries = useAppSelector(selectSystemCountries);
  const { updateStatus, updateError: error } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const fields = mapCountriesToFieldOptions(mapDisabledFields(CREATE_COMPANY_DETAILS_FORM_SCHEMA.fields, userRoles), countries);
  const actions = CREATE_COMPANY_DETAILS_FORM_SCHEMA.actions.map((action) =>
    action.name === FormActionName.submit
      ? { ...action, disabled: !hasAllowedRole(action.roles, userRoles), loading: updateStatus === 'loading' }
      : action
  );
  const errors = isUserAdmin ? deepCopyObject(error?.errors) : USER_PERMISSION_GENERAL_MESSAGE;

  const handleSubmit = (data: CompanyDTO) => {
    dispatch(createCompany(data));
  };

  return (
    <Form<Company>
      module={testModule}
      subModule={testSubModule}
      defaultValues={COMPANY_DETAILS_FORM_DEFAULT_VALUES}
      errors={errors}
      onSubmit={handleSubmit}
    >
      <Form.Header>{CREATE_COMPANY_DETAILS_FORM_SCHEMA.title}</Form.Header>
      <Form.Content fields={fields} />
      <Form.Actions actions={actions}></Form.Actions>
    </Form>
  );
};

export default CreateCompanyPage;
