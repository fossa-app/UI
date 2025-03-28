import * as React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchBranchById, resetBranch, selectBranch, selectUserRoles } from 'store/features';
import { Module, SubModule, UserRole } from 'shared/models';
import { BRANCH_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import WithRolesLayout from 'components/layouts/WithRolesLayout';
import ViewDetails from 'components/UI/ViewDetails';

const testModule = Module.branchManagement;
const testSubModule = SubModule.branchViewDetails;

const ViewBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: branch, fetchStatus } = useAppSelector(selectBranch);
  const userRoles = useAppSelector(selectUserRoles);
  const { id } = useParams();
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
  };

  const handleEditClick = () => {
    const editPath = generatePath(ROUTES.editBranch.path, { id });

    navigate(editPath);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById({ id, skipState: false }));
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
      module={testModule}
      subModule={testSubModule}
      pageTitle="View Branch"
      displayNotFoundPage={fetchStatus === 'failed' && !branch}
      onBackButtonClick={navigateBack}
    >
      <ViewDetails module={testModule} subModule={testSubModule} loading={loading}>
        <ViewDetails.Header>Branch Details</ViewDetails.Header>
        <ViewDetails.Content fields={BRANCH_VIEW_DETAILS_SCHEMA} values={branch} />
        <ViewDetails.Actions>
          <WithRolesLayout allowedRoles={[UserRole.administrator]} userRoles={userRoles}>
            <Button
              data-cy={`${testModule}-${testSubModule}-view-action-button`}
              aria-label="Edit Branch Button"
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </WithRolesLayout>
        </ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewBranchPage;
