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
} from 'store/features';
import { BranchDTO, Module, SubModule } from 'shared/models';
import { BRANCH_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { mapDisabledFields, mapTimeZonesToFieldSelectOptions } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import BrachDetailsForm from 'components/forms/BranchDetailsForm';

const SetupBranchPage: React.FC = () => {
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { updateStatus } = useAppSelector(selectBranch);
  const { status: companyLicenseStatus } = useAppSelector(selectCompanyLicense);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const dispatch = useAppDispatch();

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
        fields={mapTimeZonesToFieldSelectOptions(mapDisabledFields(BRANCH_SETUP_DETAILS_FORM_SCHEMA, userRoles), companyTimeZones)}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default SetupBranchPage;
