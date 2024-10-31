import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, editBranch, fetchBranchById, selectBranch } from 'store/features';
import { ROUTES } from 'shared/constants';
import { Branch } from 'shared/models';
import Page, { PageTitle } from 'components/UI/Page';
import BrachDetailsForm from './components/BrachDetailsForm';

const CreateEditBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: branch, updateStatus, error } = useAppSelector(selectBranch);
  const { id } = useParams();
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateBack = () => {
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
    <>
      {/* TODO: create a FormLayout component identical to TableLayout */}
      <Page>
        <PageTitle withBackButton onBackButtonClick={navigateBack}>
          {id ? 'Edit Branch' : 'Create Branch'}
        </PageTitle>
      </Page>
      <BrachDetailsForm
        data={id ? branch : null}
        error={updateStatus === 'failed' ? error : undefined}
        loading={updateStatus === 'loading'}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateEditBranchPage;
