import React from 'react';
import { ROUTES, BRANCH_VIEW_DETAILS_SCHEMA } from 'shared/constants';
import { selectBranch, resetBranch } from 'store/features';
import { fetchBranchById } from 'store/thunks';
import { Branch, Module, SubModule } from 'shared/models';
import ViewEntity from 'components/Entity/ViewEntity';

const ViewBranchPage: React.FC = () => (
  <ViewEntity<Branch>
    module={Module.branchManagement}
    subModule={SubModule.branchViewDetails}
    pageTitle="View Branch"
    fallbackRoute={ROUTES.branches.path}
    selectEntity={selectBranch}
    resetEntity={resetBranch}
    fetchEntityAction={({ id }) => fetchBranchById({ id, skipState: false })}
    viewSchema={BRANCH_VIEW_DETAILS_SCHEMA}
    editRoute={ROUTES.editBranch.path}
  />
);

export default ViewBranchPage;
