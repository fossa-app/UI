import * as React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createBranch,
  fetchCompanyLicense,
  selectBranch,
  selectCompanyLicense,
  selectIsUserAdmin,
  selectCompanyTimeZones,
  selectUserRoles,
  selectCompany,
  selectSystemCountries,
} from 'store/features';
import { BranchDTO, Module, SubModule } from 'shared/models';
import { BRANCH_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { mapDisabledFields, mapOptionsToFieldSelectOptions } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import BrachDetailsForm from 'components/forms/BranchDetailsForm';

const SetupBranchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { data: company } = useAppSelector(selectCompany);
  const { updateStatus } = useAppSelector(selectBranch);
  const { status: companyLicenseStatus } = useAppSelector(selectCompanyLicense);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const countries = useAppSelector(selectSystemCountries);
  const availableCountries = countries?.filter(({ code }) => code === company?.countryCode) || [];

  const handleSubmit = (data: BranchDTO) => {
    dispatch(createBranch([data]));
  };

  React.useEffect(() => {
    if (companyLicenseStatus === 'idle') {
      dispatch(fetchCompanyLicense());
    }
  }, [companyLicenseStatus, dispatch]);

  return (
    <PageLayout module={Module.branchSetup} subModule={SubModule.branchDetails} pageTitle="Create Branch">
      <BrachDetailsForm
        module={Module.branchSetup}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        actionLabel="Next"
        actionIcon={<NavigateNextIcon />}
        actionLoading={updateStatus === 'loading'}
        fields={mapOptionsToFieldSelectOptions(
          mapDisabledFields(BRANCH_SETUP_DETAILS_FORM_SCHEMA, userRoles),
          companyTimeZones,
          availableCountries
        )}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default SetupBranchPage;
