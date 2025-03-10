import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { CompanyDTO, Module, SubModule } from 'shared/models';
import { mapCountriesToFieldOptions, mapDisabledFields } from 'shared/helpers';
import CompanyDetailsForm from 'components/forms/CompanyDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const EditCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const countries = useAppSelector(selectSystemCountries);
  const { data: company, fetchStatus, updateStatus } = useAppSelector(selectCompany);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateToViewCompany = React.useCallback(() => {
    navigate(ROUTES.viewCompany.path);
  }, [navigate]);

  const fields = React.useMemo(
    () => mapCountriesToFieldOptions(mapDisabledFields(COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA, userRoles), countries),
    [userRoles, countries]
  );

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

  const handleSubmit = (data: Omit<CompanyDTO, 'id'>) => {
    dispatch(editCompany(data));
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    setFormSubmitted(false);
    navigateToViewCompany();
  };

  return (
    <PageLayout module={Module.companyManagement} subModule={SubModule.companyDetails} pageTitle="Edit Company">
      <CompanyDetailsForm
        withCancel
        module={Module.companyManagement}
        subModule={SubModule.companyDetails}
        isAdmin={isUserAdmin}
        data={company}
        actionLoading={updateStatus === 'loading'}
        formLoading={fetchStatus === 'loading'}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default EditCompanyPage;
