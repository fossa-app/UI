import React from 'react';
import {
  selectBranchCatalog,
  selectBranch,
  updateBranchesPagination,
  resetBranchesFetchStatus,
  resetBranchesPagination,
} from 'store/features';
import { deleteBranch, fetchBranches } from 'store/thunks';
import { Branch, Module, SubModule } from 'shared/models';
import { BRANCH_FIELDS, BRANCH_TABLE_SCHEMA, BRANCH_TABLE_ACTIONS_SCHEMA, ROUTES } from 'shared/constants';
import Catalog from 'components/Catalog';

const testModule = Module.branchManagement;
const testSubModule = SubModule.branchCatalog;

const BranchCatalogPage: React.FC = () => {
  return (
    <Catalog<Branch>
      module={testModule}
      subModule={testSubModule}
      pageTitle="Branches"
      noRecordsLabel="No Branches Found"
      actionButtonLabel="New Branch"
      newPath={ROUTES.newBranch.path}
      viewPath={ROUTES.viewBranch.path}
      editPath={ROUTES.editBranch.path}
      deleteAction={deleteBranch}
      fetchAction={fetchBranches}
      updatePagination={updateBranchesPagination}
      resetFetchStatus={resetBranchesFetchStatus}
      resetPagination={resetBranchesPagination}
      selectCatalog={selectBranchCatalog}
      selectEntity={selectBranch}
      tableSchema={BRANCH_TABLE_SCHEMA}
      tableActionsSchema={BRANCH_TABLE_ACTIONS_SCHEMA}
      primaryField={BRANCH_FIELDS.name.field}
      getPrimaryText={(branch) => branch.name}
    />
  );
};

export default BranchCatalogPage;
