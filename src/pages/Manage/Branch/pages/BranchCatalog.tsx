import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  resetBranchesFetchStatus,
  resetBranchesPagination,
  selectBranch,
  selectBranchCatalog,
  selectUserRoles,
  updateBranchesPagination,
} from 'store/features';
import { deleteBranch, fetchBranches } from 'store/thunks';
import { Branch, Module, PaginationParams, SubModule, UserRole } from 'shared/models';
import { ACTION_FIELDS, APP_CONFIG, BRANCH_FIELDS, BRANCH_TABLE_ACTIONS_SCHEMA, BRANCH_TABLE_SCHEMA, ROUTES } from 'shared/constants';
import { getTestSelectorByModule } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import Page from 'components/UI/Page';
import Table, { mapTableActionsColumn, ActionsMenu } from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import { renderPrimaryLinkText } from 'components/UI/helpers/renderPrimaryLinkText';

const testModule = Module.branchManagement;
const testSubModule = SubModule.branchCatalog;

const BranchCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: fetchStatus, items: branches, page = APP_CONFIG.table.defaultPagination } = useAppSelector(selectBranchCatalog);
  const { deleteStatus } = useAppSelector(selectBranch);
  const userRoles = useAppSelector(selectUserRoles);
  const { searchTerm: search, searchTermChanged, setSearchTermChanged, setPortalProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const loading = fetchStatus === 'loading' || deleteStatus === 'loading';
  const handleNavigate = (path: string) => navigate(path);

  const handleBranchAction = (branch: Branch, action: keyof typeof ACTION_FIELDS) => {
    switch (action) {
      case 'view':
        handleNavigate(generatePath(ROUTES.viewBranch.path, { id: branch.id }));
        break;
      case 'edit':
        handleNavigate(generatePath(ROUTES.editBranch.path, { id: branch.id }));
        break;
      case 'delete':
        if (page.pageNumber! > 1 && branches.length === 1) {
          dispatch(updateBranchesPagination({ pageNumber: page.pageNumber! - 1 }));
        }
        dispatch(deleteBranch(branch.id));
        break;
    }
  };

  const handlePageChange = (pagination: Partial<PaginationParams>) => {
    dispatch(resetBranchesFetchStatus());
    dispatch(updateBranchesPagination({ ...pagination, search }));
  };

  const actions = BRANCH_TABLE_ACTIONS_SCHEMA.map((action) => ({
    ...action,
    onClick: (branch: Branch) => handleBranchAction(branch, action.field as keyof typeof ACTION_FIELDS),
  }));

  const columns = mapTableActionsColumn(
    BRANCH_TABLE_SCHEMA.map((column) =>
      column.field === BRANCH_FIELDS.name.field
        ? {
            ...column,
            renderBodyCell: (branch: Branch) =>
              renderPrimaryLinkText({
                item: branch,
                getText: ({ name }) => name,
                onClick: () => handleBranchAction(branch, 'view'),
              }),
          }
        : column
    ),
    (branch) => (
      <ActionsMenu<Branch> module={testModule} subModule={testSubModule} actions={actions} context={branch} userRoles={userRoles} />
    )
  );

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchBranches(page));
    }
  }, [fetchStatus, page, dispatch]);

  React.useEffect(() => {
    setPortalProps({
      label: 'Search Branches',
      testSelector: getTestSelectorByModule(testModule, testSubModule, 'search-branches'),
    });
  }, [setPortalProps]);

  React.useEffect(() => {
    if (searchTermChanged) {
      dispatch(resetBranchesFetchStatus());
      dispatch(updateBranchesPagination({ search, pageNumber: 1 }));
      setSearchTermChanged(false);
    }
  }, [search, searchTermChanged, setSearchTermChanged, dispatch]);

  useUnmount(() => {
    if (search) {
      dispatch(resetBranchesFetchStatus());
      dispatch(resetBranchesPagination());
    }
  });

  return (
    <TableLayout
      module={testModule}
      subModule={testSubModule}
      userRoles={userRoles}
      allowedRoles={[UserRole.administrator]}
      pageTitle="Branches"
      actionButtonLabel="New Branch"
      onActionClick={() => handleNavigate(ROUTES.newBranch.path)}
    >
      <Table<Branch>
        module={testModule}
        subModule={testSubModule}
        loading={loading}
        columns={columns}
        items={branches}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page module={testModule} subModule={testSubModule} sx={{ m: 0 }}>
            <Page.Subtitle variant="h6">No Branches Found</Page.Subtitle>
          </Page>
        }
        onPageNumberChange={(pageNumber) => handlePageChange({ pageNumber })}
        onPageSizeChange={(pageSize) => handlePageChange({ pageSize, pageNumber: 1 })}
      />
    </TableLayout>
  );
};

export default BranchCatalogPage;
