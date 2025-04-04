import * as React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchBranchById, resetBranch, selectBranch, selectUserRoles } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { BRANCH_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import { hasAllowedRole } from 'shared/helpers';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName } from 'components/UI/ViewDetails';

const testModule = Module.branchManagement;
const testSubModule = SubModule.branchViewDetails;

const ViewBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: branch, fetchStatus } = useAppSelector(selectBranch);
  const userRoles = useAppSelector(selectUserRoles);
  const { id } = useParams();
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const handleEdit = React.useCallback(() => {
    const editPath = generatePath(ROUTES.editBranch.path, { id });

    navigate(editPath);
  }, [id, navigate]);

  const actions = React.useMemo(
    () =>
      BRANCH_VIEW_DETAILS_SCHEMA.actions
        ?.filter(({ roles }) => hasAllowedRole(roles, userRoles))
        .map((action) => {
          switch (action.name) {
            case ViewDetailActionName.edit:
              return { ...action, onClick: handleEdit };
            default:
              return action;
          }
        }),
    [userRoles, handleEdit]
  );

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
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
        <ViewDetails.Header>{BRANCH_VIEW_DETAILS_SCHEMA.title}</ViewDetails.Header>
        <ViewDetails.Content fields={BRANCH_VIEW_DETAILS_SCHEMA.fields} values={branch} />
        <ViewDetails.Actions actions={actions!}></ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewBranchPage;
