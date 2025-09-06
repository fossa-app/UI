import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchProfile, selectProfile } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { PROFILE_VIEW_DETAILS_SCHEMA, ROUTES, ACTION_BUTTON_STYLES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName } from 'components/UI/ViewDetails';
import DeleteProfileDialog from '../components/DeleteProfileDialog';

const testModule = PROFILE_VIEW_DETAILS_SCHEMA.module;
const testSubModule = PROFILE_VIEW_DETAILS_SCHEMA.subModule;

const ViewProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile, fetchStatus } = useAppSelector(selectProfile);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const handleEdit = React.useCallback(() => {
    navigate(ROUTES.editProfile.path);
  }, [navigate]);

  const actions = React.useMemo(
    () =>
      PROFILE_VIEW_DETAILS_SCHEMA.actions?.map((action) => {
        switch (action.name) {
          case ViewDetailActionName.edit:
            return { ...action, onClick: handleEdit };
          default:
            return action;
        }
      }),
    [handleEdit]
  );

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleDeleteAction = () => {
    setDialogOpen(false);
    navigate(ROUTES.deleteEmployee.path);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [fetchStatus, dispatch]);

  return (
    <>
      <PageLayout module={testModule} subModule={testSubModule} pageTitle="View Profile">
        <Grid container spacing={5}>
          <Grid size={12}>
            <ViewDetails module={testModule} subModule={testSubModule} loading={loading}>
              <ViewDetails.Header>{PROFILE_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
              <ViewDetails.Content fields={PROFILE_VIEW_DETAILS_SCHEMA.fields} values={profile} />
              <ViewDetails.Actions actions={actions!}></ViewDetails.Actions>
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
              <ViewDetails.Actions sx={{ justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                  <Typography data-cy={`${Module.profile}-${SubModule.profileViewSettings}-view-action-title`} variant="subtitle1">
                    Delete Profile
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
                  sx={ACTION_BUTTON_STYLES}
                  onClick={handleDeleteClick}
                >
                  Delete Profile
                </Button>
              </ViewDetails.Actions>
            </ViewDetails>
          </Grid>
        </Grid>
      </PageLayout>
      <DeleteProfileDialog
        module={Module.profile}
        subModule={SubModule.profileViewSettings}
        open={dialogOpen}
        onClose={handleClose}
        onDelete={handleDeleteAction}
      />
    </>
  );
};

export default ViewProfilePage;
