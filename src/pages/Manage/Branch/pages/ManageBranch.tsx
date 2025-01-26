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
import { BranchDTO, Module, SubModule } from 'shared/models';
import { mapDisabledFields, mapOptionsToFieldSelectOptions } from 'shared/helpers';
import BrachDetailsForm from 'components/forms/BranchDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

// TODO: maybe rename to CreateEditBranch
const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { data: company } = useAppSelector(selectCompany);
  const countries = useAppSelector(selectSystemCountries);
  const { data: branch, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const { id } = useParams();
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
  const availableCountries = countries?.filter(({ code }) => code === company?.countryCode || code === branch?.address.countryCode) || [];

  const navigateBack = React.useCallback(() => {
    navigate(ROUTES.branches.path);
  }, [navigate]);

  const resetState = () => {
    setFormSubmitted(false);
    dispatch(resetBranch());
  };

  const handleSubmit = (data: Omit<BranchDTO, 'id'>) => {
    if (id) {
      dispatch(editBranch([id, data]));
    } else {
      dispatch(createBranch([data, false]));
    }

    setFormSubmitted(true);
  };

  const handleCancel = () => {
    resetState();
    navigateBack();
  };

  const handleBackButtonClick = () => {
    resetState();
    navigateBack();
  };

  // TODO: move this logic to PageLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      navigateBack();
    }
  }, [updateStatus, formSubmitted, navigateBack]);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      if (formSubmitted) {
        dispatch(resetBranchesFetchStatus());
      }
    };
  }, [formSubmitted, dispatch]);

  return (
    <PageLayout
      withBackButton
      module={Module.branchManagement}
      subModule={SubModule.branchDetails}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={handleBackButtonClick}
    >
      <BrachDetailsForm
        withCancel
        module={Module.branchManagement}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        data={branch}
        fields={mapOptionsToFieldSelectOptions(
          mapDisabledFields(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, userRoles),
          companyTimeZones,
          availableCountries
        )}
        actionLoading={updateStatus === 'loading'}
        formLoading={fetchStatus === 'loading'}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
};

export default ManageBranchPage;
