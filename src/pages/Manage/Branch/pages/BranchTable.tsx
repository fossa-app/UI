import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  deleteBranch,
  fetchBranches,
  resetBranchesFetchStatus,
  selectBranch,
  selectBranches,
  selectIsUserAdmin,
  selectUserRoles,
  setBranchesPagination,
} from 'store/features';
import { Branch, Module, SubModule } from 'shared/models';
import { ACTION_FIELDS, APP_CONFIG, BRANCH_TABLE_ACTIONS_SCHEMA, BRANCH_TABLE_SCHEMA, ROUTES } from 'shared/constants';
import { filterTableActionsByRoles, getTestSelectorByModule, mapTableActionsColumn } from 'shared/helpers';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import ActionsMenu from 'components/UI/Table/ActionsMenu';

const BranchTablePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchStatus, data: branches, page } = useAppSelector(selectBranches);
  const { deleteStatus } = useAppSelector(selectBranch);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const userRoles = useAppSelector(selectUserRoles);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const loading = fetchStatus === 'loading' || deleteStatus === 'loading';

  const noRecordsTemplate = (
    <Page sx={{ margin: 0 }}>
      <PageSubtitle data-cy={getTestSelectorByModule(Module.branchManagement, SubModule.branchTable, 'table-no-branches')} fontSize={20}>
        No Branches Found
      </PageSubtitle>
    </Page>
  );

  const handlePageNumberChange = (pageNumber: number) => {
    dispatch(resetBranchesFetchStatus());
    dispatch(setBranchesPagination({ ...page, pageNumber, pageSize }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(resetBranchesFetchStatus());
    dispatch(setBranchesPagination({ ...page, pageSize, pageNumber: 1 }));
  };

  const handleTableLayoutActionClick = () => {
    navigate(ROUTES.newBranch.path);
  };

  const handleViewBranch = ({ id }: Branch) => {
    const viewPath = generatePath(ROUTES.viewBranch.path, { id });

    navigate(viewPath);
  };

  const handleDeleteBranch = ({ id }: Branch) => {
    const itemsLength = branches?.items.length || 0;

    if (pageNumber > 1 && itemsLength <= 1) {
      dispatch(setBranchesPagination({ ...page, pageSize, pageNumber: pageNumber - 1 }));
    }

    dispatch(deleteBranch(id));
  };

  const handleEditBranch = ({ id }: Branch) => {
    const editPath = generatePath(ROUTES.editBranch.path, { id });

    navigate(editPath);
  };

  const actionHandlers = {
    [ACTION_FIELDS.view.field]: handleViewBranch,
    [ACTION_FIELDS.edit.field]: handleEditBranch,
    [ACTION_FIELDS.delete.field]: handleDeleteBranch,
  };

  const actions = filterTableActionsByRoles<Branch>(BRANCH_TABLE_ACTIONS_SCHEMA, userRoles).map((action) => ({
    ...action,
    onClick: actionHandlers[action.field],
  }));

  const renderActionButtons = (branch: Branch) => (
    <ActionsMenu<Branch> module={Module.branchManagement} subModule={SubModule.branchTable} actions={actions} context={branch} />
  );

  const columns = mapTableActionsColumn(BRANCH_TABLE_SCHEMA, renderActionButtons);

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchBranches([{ pageNumber, pageSize }]));
    }
  }, [fetchStatus, pageNumber, pageSize, dispatch]);

  return (
    <TableLayout
      module={Module.branchManagement}
      subModule={SubModule.branchTable}
      withActionButton={isUserAdmin}
      pageTitle="Branches"
      actionButtonLabel="New Branch"
      onActionClick={handleTableLayoutActionClick}
    >
      <Table<Branch>
        module={Module.branchManagement}
        subModule={SubModule.branchTable}
        loading={loading}
        columns={columns}
        items={branches?.items}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={noRecordsTemplate}
        onPageNumberChange={handlePageNumberChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </TableLayout>
  );
};

export default BranchTablePage;
