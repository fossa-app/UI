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
} from 'store/features';
import { COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { CompanyDTO, Module, SubModule } from 'shared/models';
import { mapCountriesToFieldSelectOptions, mapDisabledFields } from 'shared/helpers';
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

  const handleSubmit = (data: Omit<CompanyDTO, 'id'>) => {
    dispatch(editCompany(data));
    setFormSubmitted(true);
  };

  // TODO: move this logic to FormLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      navigateToViewCompany();
    }
  }, [updateStatus, formSubmitted, navigateToViewCompany]);

  React.useEffect(() => {
    return () => {
      dispatch(resetCompanyFetchStatus());
    };
  }, [dispatch]);

  return (
    <PageLayout module={Module.companyManagement} subModule={SubModule.companyDetails} pageTitle="Edit Company">
      <CompanyDetailsForm
        module={Module.companyManagement}
        subModule={SubModule.companyDetails}
        isAdmin={isUserAdmin}
        data={company}
        buttonLoading={updateStatus === 'loading'}
        fields={mapCountriesToFieldSelectOptions(mapDisabledFields(COMPANY_MANAGEMENT_DETAILS_FORM_SCHEMA, userRoles), countries)}
        formLoading={fetchStatus === 'loading'}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default EditCompanyPage;
