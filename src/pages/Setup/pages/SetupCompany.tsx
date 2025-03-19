import * as React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin, selectUserRoles, selectSystemCountries } from 'store/features';
import { CompanyDTO, Module, SubModule } from 'shared/models';
import { deepCopyObject, mapCountriesToFieldOptions, mapDisabledFields } from 'shared/helpers';
import { COMPANY_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import CompanyDetailsForm from 'components/forms/CompanyDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const SetupCompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const countries = useAppSelector(selectSystemCountries);
  const { error, updateStatus } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const fields = React.useMemo(
    () => mapCountriesToFieldOptions(mapDisabledFields(COMPANY_SETUP_DETAILS_FORM_SCHEMA, userRoles), countries),
    [userRoles, countries]
  );

  const errors = React.useMemo(() => {
    return deepCopyObject(error?.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

  const handleSubmit = (data: CompanyDTO) => {
    dispatch(createCompany(data));
  };

  return (
    <PageLayout module={Module.companySetup} subModule={SubModule.companyDetails} pageTitle="Create Company">
      <CompanyDetailsForm
        module={Module.companySetup}
        subModule={SubModule.companyDetails}
        isAdmin={isUserAdmin}
        actionLabel="Next"
        actionIcon={<NavigateNextIcon />}
        actionLoading={updateStatus === 'loading'}
        fields={fields}
        errors={errors}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default SetupCompanyPage;
