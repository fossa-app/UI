import * as React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin, selectUserRoles } from 'store/features';
import { Company, Module, SubModule } from 'shared/models';
import { mapDisabledFields } from 'shared/helpers';
import { COMPANY_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import CompanyDetailsForm from 'components/forms/CompanyDetailsForm';
import FormLayout from 'components/layouts/FormLayout';

const SetupCompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const { updateStatus } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const handleSubmit = (data: Company) => {
    dispatch(createCompany(data));
  };

  return (
    <FormLayout module={Module.companySetup} subModule={SubModule.companyDetails} pageTitle={'Create Company'}>
      <CompanyDetailsForm
        module={Module.companySetup}
        subModule={SubModule.companyDetails}
        isAdmin={isUserAdmin}
        buttonLabel="Next"
        buttonIcon={<NavigateNextIcon />}
        buttonLoading={updateStatus === 'loading'}
        fields={mapDisabledFields(COMPANY_SETUP_DETAILS_FORM_SCHEMA, userRoles)}
        onSubmit={handleSubmit}
      />
    </FormLayout>
  );
};

export default SetupCompanyPage;
