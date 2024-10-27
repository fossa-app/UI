import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'shared/constants';
import Page, { PageTitle } from 'components/UI/Page';

const CreateEditEmployeePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(ROUTES.employees.path);
  };

  return (
    <Page>
      <PageTitle withBackButton onBackButtonClick={handleBackButtonClick}>
        Create Employee
      </PageTitle>
    </Page>
  );
};

export default CreateEditEmployeePage;
