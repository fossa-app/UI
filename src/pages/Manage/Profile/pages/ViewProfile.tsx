import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployee, selectEmployee } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { PROFILE_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';

const ViewProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: employee, fetchStatus } = useAppSelector(selectEmployee);

  const handleEditClick = () => {
    navigate(ROUTES.editProfile.path);
  };

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchEmployee());
    }
  }, [fetchStatus, dispatch]);

  return (
    <PageLayout module={Module.profile} subModule={SubModule.profileViewDetails} pageTitle="View Profile">
      <ViewDetails module={Module.profile} subModule={SubModule.profileViewDetails} loading={fetchStatus === 'loading'}>
        <ViewDetails.Header>Profile Details</ViewDetails.Header>
        <ViewDetails.Content fields={PROFILE_VIEW_DETAILS_SCHEMA} values={employee} />
        <ViewDetails.Actions>
          <Button
            data-cy={`${Module.profile}-${SubModule.profileViewDetails}-view-action-button`}
            aria-label="Edit Profile Button"
            variant="contained"
            color="primary"
            onClick={handleEditClick}
          >
            Edit
          </Button>
        </ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewProfilePage;
