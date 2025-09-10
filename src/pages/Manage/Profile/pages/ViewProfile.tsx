import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchProfile, selectProfile } from 'store/features';
import { PROFILE_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName } from 'components/UI/ViewDetails';

const testModule = PROFILE_VIEW_DETAILS_SCHEMA.module;
const testSubModule = PROFILE_VIEW_DETAILS_SCHEMA.subModule;

const ViewProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile, fetchStatus } = useAppSelector(selectProfile);
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

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [fetchStatus, dispatch]);

  return (
    <PageLayout module={testModule} subModule={testSubModule} pageTitle="View Profile">
      <Grid container spacing={5}>
        <Grid size={12}>
          <ViewDetails module={testModule} subModule={testSubModule} loading={loading}>
            <ViewDetails.Header>{PROFILE_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
            <ViewDetails.Content fields={PROFILE_VIEW_DETAILS_SCHEMA.fields} values={profile} />
            <ViewDetails.Actions actions={actions!}></ViewDetails.Actions>
          </ViewDetails>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default ViewProfilePage;
