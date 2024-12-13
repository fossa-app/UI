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
} from 'store/features';
import { BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { BranchDTO, Module, SubModule } from 'shared/models';
import { mapDisabledFields, mapTimeZonesToFieldSelectOptions } from 'shared/helpers';
import BrachDetailsForm from 'components/forms/BranchDetailsForm';
import PageLayout from 'components/layouts/PageLayout';

// TODO: maybe rename to CreateEditBranch
const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { data: branch, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const { id } = useParams();
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateBack = React.useCallback(() => {
    navigate(ROUTES.branches.path);
  }, [navigate]);

  const handleSubmit = (data: Omit<BranchDTO, 'id'>) => {
    if (id) {
      dispatch(editBranch([id, data]));
    } else {
      dispatch(createBranch([data, false]));
    }

    setFormSubmitted(true);
  };

  // TODO: move this logic to FormLayout
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
      dispatch(resetBranch());
      dispatch(resetBranchesFetchStatus());
    };
  }, [dispatch]);

  return (
    <PageLayout
      withBackButton
      module={Module.branchManagement}
      subModule={SubModule.branchDetails}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={navigateBack}
    >
      <BrachDetailsForm
        module={Module.branchManagement}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        data={branch}
        fields={mapTimeZonesToFieldSelectOptions(mapDisabledFields(BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, userRoles), companyTimeZones)}
        formLoading={fetchStatus === 'loading'}
        buttonLoading={updateStatus === 'loading'}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
};

export default ManageBranchPage;
