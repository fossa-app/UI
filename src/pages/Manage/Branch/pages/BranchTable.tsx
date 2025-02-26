import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  deleteBranch,
  fetchBranches,
  resetBranchesFetchStatus,
  resetBranchesPagination,
  selectBranch,
  selectBranches,
  selectIsUserAdmin,
  selectUserRoles,
  setBranchesPagination,
} from 'store/features';
import { Branch, Module, PaginationParams, SubModule } from 'shared/models';
import { ACTION_FIELDS, APP_CONFIG, BRANCH_FIELDS, BRANCH_TABLE_ACTIONS_SCHEMA, BRANCH_TABLE_SCHEMA, ROUTES } from 'shared/constants';
import { filterTableActionsByRoles, getTestSelectorByModule, mapTableActionsColumn } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table from 'components/UI/Table';
import ActionsMenu from 'components/UI/Table/ActionsMenu';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import { renderPrimaryLinkText } from 'components/UI/PrimaryLinkText';

const BranchTablePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchStatus, data: branches, page = APP_CONFIG.table.defaultPagination as PaginationParams } = useAppSelector(selectBranches);
  const { deleteStatus } = useAppSelector(selectBranch);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const { search, searchChanged, setSearchChanged, setProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const loading = fetchStatus === 'loading' || deleteStatus === 'loading';
  const handleNavigate = React.useCallback((path: string) => navigate(path), [navigate]);

  const handleBranchAction = React.useCallback(
    (branch: Branch, action: keyof typeof ACTION_FIELDS) => {
      switch (action) {
        case 'view':
          handleNavigate(generatePath(ROUTES.viewBranch.path, { id: branch.id }));
          break;
        case 'edit':
          handleNavigate(generatePath(ROUTES.editBranch.path, { id: branch.id }));
          break;
        case 'delete':
          if (page.pageNumber! > 1 && branches?.items.length === 1) {
            dispatch(setBranchesPagination({ pageNumber: page.pageNumber! - 1 }));
          }
          dispatch(deleteBranch(branch.id));
          break;
      }
    },
    [handleNavigate, dispatch, page.pageNumber, branches?.items.length]
  );

  const handlePageChange = React.useCallback(
    (pagination: Partial<PaginationParams>) => {
      dispatch(resetBranchesFetchStatus());
      dispatch(setBranchesPagination(pagination));
    },
    [dispatch]
  );

  const actions = React.useMemo(
    () =>
      filterTableActionsByRoles<Branch>(BRANCH_TABLE_ACTIONS_SCHEMA, userRoles).map((action) => ({
        ...action,
        onClick: (branch: Branch) => handleBranchAction(branch, action.field as keyof typeof ACTION_FIELDS),
      })),
    [userRoles, handleBranchAction]
  );

  const columns = React.useMemo(
    () =>
      mapTableActionsColumn(
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
          <ActionsMenu<Branch> module={Module.branchManagement} subModule={SubModule.branchTable} actions={actions} context={branch} />
        )
      ),
    [actions, handleBranchAction]
  );

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchBranches([page]));
    }
  }, [fetchStatus, page, dispatch]);

  React.useEffect(() => {
    setProps({ label: 'Search Branches', testSelector: 'search-branches' });
  }, [setProps]);

  React.useEffect(() => {
    if (searchChanged) {
      handlePageChange({ search, pageNumber: 1 });
      setSearchChanged(false);
    }
  }, [search, searchChanged, handlePageChange, setSearchChanged]);

  useUnmount(() => {
    // TODO: search is not being reset correctly which causes multiple fetching
    if (search) {
      setSearchChanged(false);
      dispatch(resetBranchesFetchStatus());
      dispatch(resetBranchesPagination());
    }
  });

  return (
    <TableLayout
      module={Module.branchManagement}
      subModule={SubModule.branchTable}
      withActionButton={isUserAdmin}
      pageTitle="Branches"
      actionButtonLabel="New Branch"
      onActionClick={() => handleNavigate(ROUTES.newBranch.path)}
    >
      <Table<Branch>
        module={Module.branchManagement}
        subModule={SubModule.branchTable}
        loading={loading}
        columns={columns}
        items={branches?.items}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page sx={{ margin: 0 }}>
            <PageSubtitle
              data-cy={getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches')}
              variant="h6"
            >
              No Branches Found
            </PageSubtitle>
          </Page>
        }
        onPageNumberChange={(pageNumber) => handlePageChange({ pageNumber })}
        onPageSizeChange={(pageSize) => handlePageChange({ pageSize, pageNumber: 1 })}
      />
    </TableLayout>
  );
};

export default BranchTablePage;
