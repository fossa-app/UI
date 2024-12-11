import * as React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin, selectUserRoles, selectSystemCountries } from 'store/features';
import { CompanyDTO, Module, SubModule } from 'shared/models';
import { mapCountriesToFieldSelectOptions, mapDisabledFields } from 'shared/helpers';
import { COMPANY_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import CompanyDetailsForm from 'components/forms/CompanyDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const SetupCompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const countries = useAppSelector(selectSystemCountries);
  const { updateStatus } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const handleSubmit = (data: CompanyDTO) => {
    dispatch(createCompany(data));
  };

  return (
    <PageLayout module={Module.companySetup} subModule={SubModule.companyDetails} pageTitle="Create Company">
      <CompanyDetailsForm
        module={Module.companySetup}
        subModule={SubModule.companyDetails}
        isAdmin={isUserAdmin}
        buttonLabel="Next"
        buttonIcon={<NavigateNextIcon />}
        buttonLoading={updateStatus === 'loading'}
        fields={mapCountriesToFieldSelectOptions(mapDisabledFields(COMPANY_SETUP_DETAILS_FORM_SCHEMA, userRoles), countries)}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default SetupCompanyPage;
