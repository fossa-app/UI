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
  selectUserRoles,
  setBranchesPagination,
} from 'store/features';
import { Branch, Module, PaginationParams, SubModule, UserRole } from 'shared/models';
import { ACTION_FIELDS, APP_CONFIG, BRANCH_FIELDS, BRANCH_TABLE_ACTIONS_SCHEMA, BRANCH_TABLE_SCHEMA, ROUTES } from 'shared/constants';
import { getTestSelectorByModule, mapTableActionsColumn } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table from 'components/UI/Table';
import ActionsMenu from 'components/UI/Table/ActionsMenu';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import { renderPrimaryLinkText } from 'components/UI/PrimaryLinkText';

const testModule = Module.branchManagement;
const testSubModule = SubModule.branchCatalog;

const BranchCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchStatus, data: branches, page = APP_CONFIG.table.defaultPagination as PaginationParams } = useAppSelector(selectBranches);
  const { deleteStatus } = useAppSelector(selectBranch);
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
      BRANCH_TABLE_ACTIONS_SCHEMA.map((action) => ({
        ...action,
        onClick: (branch: Branch) => handleBranchAction(branch, action.field as keyof typeof ACTION_FIELDS),
      })),
    [handleBranchAction]
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
          <ActionsMenu<Branch> module={testModule} subModule={testSubModule} actions={actions} context={branch} userRoles={userRoles} />
        )
      ),
    [actions, userRoles, handleBranchAction]
  );

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchBranches([page]));
    }
  }, [fetchStatus, page, dispatch]);

  React.useEffect(() => {
    setProps({
      label: 'Search Branches',
      testSelector: getTestSelectorByModule(testModule, testSubModule, 'search-branches'),
    });
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
        items={branches?.items}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page module={testModule} subModule={testSubModule} sx={{ margin: 0 }}>
            <PageSubtitle variant="h6">No Branches Found</PageSubtitle>
          </Page>
        }
        onPageNumberChange={(pageNumber) => handlePageChange({ pageNumber })}
        onPageSizeChange={(pageSize) => handlePageChange({ pageSize, pageNumber: 1 })}
      />
    </TableLayout>
  );
};

export default BranchCatalogPage;
