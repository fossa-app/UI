import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, selectBranch } from 'store/features';
import { ROUTES } from 'shared/constants';
import Page, { PageTitle } from 'components/UI/Page';
import BrachDetailsForm from './components/BrachDetailsForm';

const CreateEditBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { updateStatus, error } = useAppSelector(selectBranch);
  const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
  };

  const handleSubmit = (name: string) => {
    dispatch(createBranch([{ name }, false]));
    setFormSubmitted(true);
  };

  React.useEffect(() => {
    if (updateStatus === 'succeeded' && formSubmitted) {
      navigateBack();
    }
  }, [updateStatus, formSubmitted]);

  return (
    <>
      {/* TODO: create a FormLayout component identical to TableLayout */}
      <Page>
        <PageTitle withBackButton onBackButtonClick={navigateBack}>
          Create Branch
        </PageTitle>
      </Page>
      <BrachDetailsForm
        error={updateStatus === 'failed' ? error : undefined}
        loading={updateStatus === 'loading'}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateEditBranchPage;
