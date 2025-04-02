import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectIsUserAdmin,
  selectUserRoles,
  editCompany,
  selectCompany,
  selectSystemCountries,
  resetCompanyFetchStatus,
  resetBranchesFetchStatus,
} from 'store/features';
import { COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA, MESSAGES, ROUTES } from 'shared/constants';
import { Company, CompanyDTO } from 'shared/models';
import { deepCopyObject, mapCountriesToFieldOptions, mapDisabledFields } from 'shared/helpers';
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
  const { data: company, error, fetchStatus, updateStatus } = useAppSelector(selectCompany);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const defaultValues: Company = {
    name: '',
    countryCode: '',
  };

  const handleSubmit = (data: Omit<CompanyDTO, 'id'>) => {
    dispatch(editCompany(data));
    setFormSubmitted(true);
  };

  const navigateToViewCompany = React.useCallback(() => {
    navigate(ROUTES.viewCompany.path);
  }, [navigate]);

  const handleCancel = React.useCallback(() => {
    setFormSubmitted(false);
    navigateToViewCompany();
  }, [navigateToViewCompany]);

  const fields = React.useMemo(
    () => mapCountriesToFieldOptions(mapDisabledFields(COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.fields, userRoles), countries),
    [userRoles, countries]
  );

  const actions = React.useMemo(
    () =>
      COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.actions.map((action) => {
        switch (action.name) {
          case FormActionName.cancel:
            return { ...action, onClick: handleCancel };
          case FormActionName.submit:
            return { ...action, loading: updateStatus === 'loading' };
          default:
            return action;
        }
      }),
    [updateStatus, handleCancel]
  );

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      dispatch(resetBranchesFetchStatus());
      navigateToViewCompany();
    }
  }, [updateStatus, formSubmitted, navigateToViewCompany, dispatch]);

  React.useEffect(() => {
    return () => {
      if (formSubmitted) {
        dispatch(resetCompanyFetchStatus());
      }
    };
  }, [formSubmitted, dispatch]);

  return (
    <PageLayout module={testModule} subModule={testSubModule} pageTitle="Edit Company">
      <Form<Company>
        module={testModule}
        subModule={testSubModule}
        defaultValues={defaultValues}
        values={company}
        errors={errors}
        loading={fetchStatus === 'loading'}
        onSubmit={handleSubmit}
      >
        <Form.Header>{COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA.title}</Form.Header>

        <Form.Content fields={fields} />

        <Form.Actions
          actions={actions}
          generalValidationMessage={isUserAdmin ? undefined : MESSAGES.error.general.permission}
        ></Form.Actions>
      </Form>
    </PageLayout>
  );
};

export default EditCompanyPage;
