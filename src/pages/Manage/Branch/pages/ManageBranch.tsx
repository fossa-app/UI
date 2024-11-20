import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, editBranch, fetchBranchById, resetBranch, selectBranch } from 'store/features';
import { ROUTES } from 'shared/constants';
import { Branch } from 'shared/models';
import FormLayout from '../../components/FormLayout';
import BrachDetailsForm from './components/BrachDetailsForm';

const ManageBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: branch, fetchStatus, updateStatus } = useAppSelector(selectBranch);
  const { id } = useParams();
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateBack = () => {
    dispatch(resetBranch());
    navigate(ROUTES.branches.path);
  };

  const handleSubmit = (formData: Omit<Branch, 'id'>) => {
    id ? dispatch(editBranch([id, formData])) : dispatch(createBranch([formData, false]));
    setFormSubmitted(true);
  };

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

  return (
    <FormLayout withBackButton pageTitle={id ? 'Edit Branch' : 'Create Branch'} onBackButtonClick={navigateBack}>
      <BrachDetailsForm
        data-cy="branch-details-form"
        data={branch}
        formLoading={fetchStatus === 'loading'}
        buttonLoading={updateStatus === 'loading'}
        onSubmit={handleSubmit}
      />
    </FormLayout>
  );
};

export default ManageBranchPage;
