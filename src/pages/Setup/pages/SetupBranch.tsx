import * as React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
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
import {
  getBranchManagementDetailsByAddressFormSchema,
  mapBranchDTO,
  mapDisabledFields,
  mapBranchFieldOptionsToFieldOptions,
  deepCopyObject,
} from 'shared/helpers';
import { BRANCH_SETUP_DETAILS_FORM_SCHEMA } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import BranchDetailsForm from 'components/forms/BranchDetailsForm';

const SetupBranchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userRoles = useAppSelector(selectUserRoles);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { data: company } = useAppSelector(selectCompany);
  const { updateStatus, error } = useAppSelector(selectBranch);
  const { status: companyLicenseStatus } = useAppSelector(selectCompanyLicense);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const countries = useAppSelector(selectSystemCountries);
  const [noPhysicalAddress, setNoPhysicalAddress] = React.useState<boolean | undefined>(undefined);

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode) || [],
    [countries, company]
  );

  const fields = React.useMemo(() => {
    const schema = getBranchManagementDetailsByAddressFormSchema(BRANCH_SETUP_DETAILS_FORM_SCHEMA, !!noPhysicalAddress);
    const disabledFields = mapDisabledFields(schema, userRoles);
    const mappedFields = mapBranchFieldOptionsToFieldOptions(disabledFields, companyTimeZones, availableCountries);

    return mappedFields;
  }, [noPhysicalAddress, userRoles, companyTimeZones, availableCountries]);

  const errors = React.useMemo(() => {
    if (!error?.errors) {
      return;
    }

    return deepCopyObject(error.errors as FieldErrors<FieldValues>);
  }, [error?.errors]);

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
    setNoPhysicalAddress(formValue.noPhysicalAddress);
  };

  return (
    <PageLayout module={Module.branchSetup} subModule={SubModule.branchDetails} pageTitle="Create Branch">
      <BranchDetailsForm
        module={Module.branchSetup}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        actionLabel="Next"
        actionIcon={<NavigateNextIcon />}
        actionLoading={updateStatus === 'loading'}
        errors={errors}
        fields={fields}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </PageLayout>
  );
};

export default SetupBranchPage;
