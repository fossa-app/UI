import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  createBranch,
  editBranch,
  fetchBranchById,
  resetBranch,
  resetBranchesFetchStatus,
  selectBranch,
  selectIsUserAdmin,
  selectCompanyTimeZones,
  selectUserRoles,
  selectCompany,
  selectSystemCountries,
} from 'store/features';
import { BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { Branch, Module, SubModule } from 'shared/models';
import { getBranchManagementDetailsFormSchema, mapBranchDTO, mapDisabledFields, mapOptionsToFieldSelectOptions } from 'shared/helpers';
import BrachDetailsForm from 'components/forms/BranchDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { data: company } = useAppSelector(selectCompany);
  const countries = useAppSelector(selectSystemCountries);
  const { data: branch, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [nonPhysicalAddress, setNonPhysicalAddress] = React.useState(branch?.nonPhysicalAddress ?? false);

  const availableCountries = React.useMemo(
    () => countries?.filter(({ code }) => code === company?.countryCode || code === branch?.address.countryCode) || [],
    [countries, company, branch]
  );

  const fields = React.useMemo(
    () =>
      mapOptionsToFieldSelectOptions(
        mapDisabledFields(getBranchManagementDetailsFormSchema(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, nonPhysicalAddress), userRoles),
        companyTimeZones,
        availableCountries
      ),
    [nonPhysicalAddress, userRoles, companyTimeZones, availableCountries]
  );

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    }
  }, [id, dispatch]);

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      navigate(ROUTES.branches.path);
      dispatch(resetBranch());
    }
  }, [updateStatus, formSubmitted, navigate, dispatch]);

  React.useEffect(() => {
    return () => {
      if (formSubmitted) {
        dispatch(resetBranchesFetchStatus());
      }
    };
  }, [formSubmitted, dispatch]);

  const handleSubmit = (formValue: Branch) => {
    const submitData = mapBranchDTO(formValue);

    if (id) {
      dispatch(editBranch([id, submitData]));
    } else {
      dispatch(createBranch([submitData, false]));
    }

    setFormSubmitted(true);
  };

  const handleChange = (formValue: Branch) => {
    setNonPhysicalAddress(!!formValue.nonPhysicalAddress);
  };

  const handleCancel = () => {
    dispatch(resetBranch());
    navigate(ROUTES.branches.path);
  };

  return (
    <PageLayout
      withBackButton
      module={Module.branchManagement}
      subModule={SubModule.branchDetails}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={handleCancel}
    >
      <BrachDetailsForm
        withCancel
        module={Module.branchManagement}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        data={branch}
        fields={fields}
        actionLoading={updateStatus === 'loading'}
        formLoading={fetchStatus === 'loading'}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default ManageBranchPage;
