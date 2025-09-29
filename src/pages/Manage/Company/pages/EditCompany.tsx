import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectIsUserAdmin,
  selectUserRoles,
  selectCompany,
  selectSystemCountries,
  resetCompanyFetchStatus,
  resetBranchesFetchStatus,
} from 'store/features';
import { editCompany } from 'store/thunks';
import {
  COMPANY_DETAILS_FORM_DEFAULT_VALUES,
  COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA,
  ROUTES,
  USER_PERMISSION_GENERAL_MESSAGE,
} from 'shared/constants';
import { Company, CompanyDTO, EntityInput } from 'shared/models';
import { deepCopyObject, mapCountriesToFieldOptions, mapDisabledFields } from 'shared/helpers';
import { useOnFormSubmitEffect } from 'shared/hooks';
import PageLayout from 'components/layouts/PageLayout';
import Form, { FormActionName } from 'components/UI/Form';

const testModule = COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.module;
const testSubModule = COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.subModule;

const EditCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const countries = useAppSelector(selectSystemCountries);
  const { item: company, updateError: error, fetchStatus, updateStatus = 'idle' } = useAppSelector(selectCompany);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
  const fields = mapCountriesToFieldOptions(mapDisabledFields(COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, userRoles), countries);
  const errors = isUserAdmin ? deepCopyObject(error?.errors) : USER_PERMISSION_GENERAL_MESSAGE;
  const navigateToViewCompany = () => navigate(ROUTES.viewCompany.path);

  const handleSubmit = (data: EntityInput<CompanyDTO>) => {
    dispatch(editCompany(data));
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    setFormSubmitted(false);
    navigateToViewCompany();
  };

  const handleSuccess = () => {
    dispatch(resetBranchesFetchStatus());
    navigateToViewCompany();
  };

  const actions = COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
    switch (action.name) {
      case FormActionName.cancel:
        return { ...action, onClick: handleCancel };
      case FormActionName.submit:
        return { ...action, loading: updateStatus === 'loading' };
      default:
        return action;
    }
  });

  React.useEffect(() => {
    return () => {
      if (formSubmitted) {
        dispatch(resetCompanyFetchStatus());
      }
    };
  }, [formSubmitted, dispatch]);

  useOnFormSubmitEffect(updateStatus, formSubmitted, handleSuccess);

  return (
    <PageLayout module={testModule} subModule={testSubModule} pageTitle="Edit Company">
      <Form<Company>
        module={testModule}
        subModule={testSubModule}
        defaultValues={COMPANY_DETAILS_FORM_DEFAULT_VALUES}
        values={company}
        errors={errors}
        loading={fetchStatus === 'loading'}
        onSubmit={handleSubmit}
      >
        <Form.Header>{COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.title}</Form.Header>
        <Form.Content fields={fields} />
        <Form.Actions actions={actions}></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default EditCompanyPage;
