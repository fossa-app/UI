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
import BrachDetailsForm from 'components/forms/BranchDetailsForm';
import FormLayout from 'components/layouts/FormLayout';
import { mapDisabledFields, mapTimeZonesToFieldSelectOptions } from 'shared/helpers';

const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const companyTimeZones = useAppSelector(selectCompanyTimeZones);
  const { data: branch, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const { id } = useParams();
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
  };

  const handleSubmit = (data: Omit<BranchDTO, 'id'>) => {
    id ? dispatch(editBranch([id, data])) : dispatch(createBranch([data, false]));
    setFormSubmitted(true);
  };

  // TODO: move this logic to FormLayout
  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      navigateBack();
    }
  }, [updateStatus, formSubmitted]);

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
    <FormLayout
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
    </FormLayout>
  );
};

export default ManageBranchPage;
