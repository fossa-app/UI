import * as React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchBranchById, resetBranch, selectBranch, selectIsUserAdmin } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { BRANCH_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';

const ViewBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: branch, fetchStatus } = useAppSelector(selectBranch);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { id } = useParams();

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
  };

  const handleEditClick = () => {
    const editPath = generatePath(ROUTES.editBranch.path, { id });

    navigate(editPath);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    }
  }, [id, dispatch]);

  React.useEffect(() => {
    return () => {
      // TODO: this causes unnecessary fetch
      dispatch(resetBranch());
    };
  }, [dispatch]);

  return (
    <PageLayout
      withBackButton
      module={Module.branchManagement}
      subModule={SubModule.branchViewDetails}
      pageTitle="View Branch"
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={navigateBack}
    >
      <ViewDetails module={Module.branchManagement} subModule={SubModule.branchViewDetails} loading={fetchStatus === 'loading'}>
        <ViewDetails.Header>Branch Details</ViewDetails.Header>
        <ViewDetails.Content fields={BRANCH_VIEW_DETAILS_SCHEMA} values={branch} />
        <ViewDetails.Actions>
          {isUserAdmin && (
            <Button
              data-cy={`${Module.branchManagement}-${SubModule.branchViewDetails}-view-action-button`}
              aria-label="Edit Branch Button"
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

export default ViewBranchPage;
