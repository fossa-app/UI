import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchProfile, selectProfile } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { PROFILE_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';

const ViewProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile, fetchStatus } = useAppSelector(selectProfile);

  const handleEditClick = () => {
    navigate(ROUTES.editProfile.path);
  };

  const handleDeleteClick = () => {
    console.log('Delete Profile');
  };

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [fetchStatus, dispatch]);

  return (
    <PageLayout module={Module.profile} subModule={SubModule.profileViewDetails} pageTitle="View Profile">
      <Grid container spacing={5}>
        <Grid size={12}>
          <ViewDetails module={Module.profile} subModule={SubModule.profileViewDetails} loading={fetchStatus === 'loading'}>
            <ViewDetails.Header>Profile Details</ViewDetails.Header>
            <ViewDetails.Content fields={PROFILE_VIEW_DETAILS_SCHEMA} values={profile} />
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
        </Grid>
        <Grid size={12}>
          <ViewDetails
            module={Module.profile}
            subModule={SubModule.profileViewSettings}
            defaultExpanded={false}
            sx={{ border: '1px solid', borderColor: 'error.main' }}
          >
            <ViewDetails.Header sx={{ color: 'error.main' }} expandIconSxProps={{ color: 'error.main' }}>
              Danger Zone
            </ViewDetails.Header>
            <ViewDetails.Actions sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography data-cy={`${Module.profile}-${SubModule.profileViewSettings}-view-action-title`} variant="subtitle1">
                  Delete profile
                </Typography>
                <Typography
                  data-cy={`${Module.profile}-${SubModule.profileViewSettings}-view-action-subtitle`}
                  variant="subtitle2"
                  color="textSecondary"
                >
                  Once you delete your profile, there is no going back. Please be certain.
                </Typography>
              </Box>
              <Button
                data-cy={`${Module.profile}-${SubModule.profileViewSettings}-view-action-button`}
                aria-label="Delete Profile Button"
                variant="contained"
                color="error"
                onClick={handleDeleteClick}
              >
                Delete Profile
              </Button>
            </ViewDetails.Actions>
          </ViewDetails>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ViewProfilePage;
