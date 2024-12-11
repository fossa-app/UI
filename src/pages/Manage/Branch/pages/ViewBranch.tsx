import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchBranchById, selectBranch } from 'store/features';
import { Module, SubModule } from 'shared/models';
import { BRANCH_VIEW_DETAILS_SCHEMA, ROUTES } from 'shared/constants';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails from 'components/UI/ViewDetails';

const ViewBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: branch, fetchStatus } = useAppSelector(selectBranch);
  const { id } = useParams();

  const navigateBack = () => {
    navigate(ROUTES.branches.path);
  };

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    }
  }, [id, dispatch]);

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
      </ViewDetails>
    </PageLayout>
  );
};

export default ViewBranchPage;
