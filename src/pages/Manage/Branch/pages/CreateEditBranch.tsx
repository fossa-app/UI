import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import Page, { PageTitle } from 'components/UI/Page';

const CreateEditBranchPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(ROUTES.branches.path);
  };

  return (
    <Page>
      <PageTitle withBackButton onBackButtonClick={handleBackButtonClick}>
        Create Branch
      </PageTitle>
    </Page>
  );
};

export default CreateEditBranchPage;
