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
} from 'store/features';
import { BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA, ROUTES } from 'shared/constants';
import { Branch, Module, SubModule } from 'shared/models';
import BrachDetailsForm from 'components/forms/BrachDetailsForm';
import FormLayout from '../../components/FormLayout';

const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { data: branch, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const { id } = useParams();
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
  };

  const handleSubmit = (formData: Omit<Branch, 'id'>) => {
    id ? dispatch(editBranch([id, formData])) : dispatch(createBranch([formData, false]));
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
    // TODO: handle not found branch case
    <FormLayout
      withBackButton
      module={Module.branchManagement}
      subModule={SubModule.branchDetails}
      pageTitle={id ? 'Edit Branch' : 'Create Branch'}
      onBackButtonClick={navigateBack}
    >
      <BrachDetailsForm
        module={Module.branchManagement}
        subModule={SubModule.branchDetails}
        isAdmin={isUserAdmin}
        data={branch}
        fields={BRANCH_MANAGEMENT_DETAILS_FORM_SCHEMA}
        formLoading={fetchStatus === 'loading'}
        buttonLoading={updateStatus === 'loading'}
        onSubmit={handleSubmit}
      />
    </FormLayout>
  );
};

export default ManageBranchPage;
