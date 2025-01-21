import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompany, selectCompany, selectIsUserAdmin } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { COMPANY_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';

const ViewCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: company, fetchStatus } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);

  const handleEditClick = () => {
    navigate(ROUTES.editCompany.path);
  };

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchCompany());
    }
  }, [fetchStatus, dispatch]);

  return (
    <PageLayout module={Module.companyManagement} subModule={SubModule.companyViewDetails} pageTitle="View Company">
      <ViewDetails module={Module.companyManagement} subModule={SubModule.companyViewDetails} loading={fetchStatus === 'loading'}>
        <ViewDetails.Header>Company Details</ViewDetails.Header>
        <ViewDetails.Content fields={COMPANY_VIEW_DETAILS_SCHEMA} values={company} />
        <ViewDetails.Actions>
          {isUserAdmin && (
            <Button
              data-cy={`${Module.companyManagement}-${SubModule.companyViewDetails}-view-action-button`}
              aria-label="Edit Company Button"
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewCompanyPage;
