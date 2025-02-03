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
import { Branch, Module, SubModule } from 'shared/models';
import { BRANCH_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import { getBranchManagementDetailsFormSchema, mapBranchDTO, mapDisabledFields, mapOptionsToFieldSelectOptions } from 'shared/helpers';
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
  const [nonPhysicalAddress, setNonPhysicalAddress] = React.useState(false);

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode) || [],
    [countries, company]
  );

  const fields = React.useMemo(
    () =>
      mapOptionsToFieldSelectOptions(
        mapDisabledFields(getBranchManagementDetailsFormSchema(BRANCH_SETUP_DETAILS_FORM_SCHEMA, nonPhysicalAddress), userRoles),
        companyTimeZones,
        availableCountries
      ),
    [nonPhysicalAddress, userRoles, companyTimeZones, availableCountries]
  );

  React.useEffect(() => {
    if (companyLicenseStatus === 'idle') {
      dispatch(fetchCompanyLicense());
    }
  }, [companyLicenseStatus, dispatch]);

  const handleSubmit = (formValue: Branch) => {
    const submitData = mapBranchDTO(formValue);

    dispatch(createBranch([submitData]));
  };

  const handleChange = (formValue: Branch) => {
    setNonPhysicalAddress(!!formValue.nonPhysicalAddress);
  };

  return (
    <PageLayout module={Module.branchSetup} subModule={SubModule.branchDetails} pageTitle="Create Branch">
      <BrachDetailsForm
        module={Module.branchSetup}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        actionLabel="Next"
        actionIcon={<NavigateNextIcon />}
        actionLoading={updateStatus === 'loading'}
        fields={fields}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </PageLayout>
  );
};

export default SetupBranchPage;
