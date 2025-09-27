import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { AppDispatch, PaginatedStateEntity, RootState, Status, useAppDispatch, useAppSelector } from 'store';
import { selectUserRoles } from 'store/features';
import { Module, SubModule, Item, PaginationParams, UserRole, ErrorResponseDTO, PaginatedResponse } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { getTestSelectorByModule } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import { useSearch } from 'components/Search';
import Page from 'components/UI/Page';
import Table, { mapTableActionsColumn, ActionsMenu, Column, Action, ActionField } from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import { renderPrimaryLinkText } from 'components/UI/helpers/renderPrimaryLinkText';

interface StateAction {
  state: RootState;
  rejectValue: ErrorResponseDTO;
  dispatch?: AppDispatch;
}

type CatalogProps<T extends Item, TState extends PaginatedStateEntity<T>> = {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  noRecordsLabel: string;
  tableSchema: Column<T>[];
  tableActionsSchema: Action<T>[];
  primaryField: string;
  actionButtonLabel?: string;
  newPath?: string;
  viewPath?: string;
  editPath?: string;
  getPrimaryText: (item: T) => string;
  fetchAction: (args: PaginationParams) => AsyncThunkAction<PaginatedResponse<T> | undefined, PaginationParams, StateAction>;
  updatePagination: (pagination: Partial<PaginationParams>) => ReturnType<AppDispatch>;
  resetFetchStatus: () => ReturnType<AppDispatch>;
  resetPagination: () => ReturnType<AppDispatch>;
  selectCatalog: (state: RootState) => TState;
  deleteAction?: (id: number) => AsyncThunkAction<void, number, StateAction>;
  selectEntity?: (state: RootState) => { deleteStatus?: Status };
};

const Catalog = <T extends Item, TState extends PaginatedStateEntity<T>>({
  module,
  subModule,
  pageTitle,
  noRecordsLabel,
  actionButtonLabel,
  newPath,
  viewPath,
  editPath,
  deleteAction,
  fetchAction,
  updatePagination,
  resetFetchStatus,
  resetPagination,
  selectCatalog,
  selectEntity,
  tableSchema,
  tableActionsSchema,
  primaryField,
  getPrimaryText,
}: CatalogProps<T, TState>) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: fetchStatus, items, page } = useAppSelector(selectCatalog);
  const userRoles = useAppSelector(selectUserRoles);
  const deleteStatus = useAppSelector((state) => (selectEntity ? selectEntity(state).deleteStatus : 'idle'));
  const { searchTerm: search, searchTermChanged, setSearchTermChanged, setPortalProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const loading = fetchStatus === 'loading' || deleteStatus === 'loading';
  const handleNavigate = (path: string) => navigate(path);

  const handleAction = (item: T, action: ActionField) => {
    switch (action) {
      case 'view':
        if (viewPath) {
          handleNavigate(generatePath(viewPath, { id: item.id }));
        }

        break;
      case 'edit':
        if (editPath) {
          handleNavigate(generatePath(editPath, { id: item.id }));
        }

        break;
      case 'delete':
        if (deleteAction) {
          if (page.pageNumber! > 1 && items.length === 1) {
            dispatch(updatePagination({ pageNumber: page.pageNumber! - 1 }));
          }

          dispatch(deleteAction(item.id));
        }

        break;
    }
  };

  const handlePageChange = (pagination: Partial<PaginationParams>) => {
    dispatch(resetFetchStatus());
    dispatch(updatePagination({ ...pagination, search }));
  };

  const actions = tableActionsSchema.map((action) => ({
    ...action,
    onClick: (item: T) => handleAction(item, action.field),
  }));

  const columns = mapTableActionsColumn(
    tableSchema.map((column) =>
      column.field === primaryField
        ? {
            ...column,
            renderBodyCell: (item: T) =>
              renderPrimaryLinkText({
                item,
                getText: getPrimaryText,
                onClick: () => handleAction(item, 'view'),
              }),
          }
        : column
    ),
    (item) => <ActionsMenu<T> module={module} subModule={subModule} actions={actions} context={item} userRoles={userRoles} />
  );

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchAction(page));
    }
  }, [fetchStatus, page, dispatch, fetchAction]);

  React.useEffect(() => {
    setPortalProps({
      label: `Search ${pageTitle}`,
      testSelector: getTestSelectorByModule(module, subModule, `search-${pageTitle.toLowerCase()}`),
    });
  }, [setPortalProps, module, subModule, pageTitle]);

  React.useEffect(() => {
    if (searchTermChanged) {
      dispatch(resetFetchStatus());
      dispatch(updatePagination({ search, pageNumber: 1 }));
      setSearchTermChanged(false);
    }
  }, [search, searchTermChanged, setSearchTermChanged, dispatch, resetFetchStatus, updatePagination]);

  useUnmount(() => {
    if (search) {
      dispatch(resetFetchStatus());
      dispatch(resetPagination());
    }
  });

  return (
    <TableLayout
      module={module}
      subModule={subModule}
      pageTitle={pageTitle}
      userRoles={userRoles}
      allowedActionRoles={[UserRole.administrator]}
      actionButtonLabel={actionButtonLabel}
      onActionClick={newPath ? () => handleNavigate(newPath) : undefined}
    >
      <Table<T>
        module={module}
        subModule={subModule}
        loading={loading}
        columns={columns}
        items={items}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page module={module} subModule={subModule} sx={{ m: 0 }}>
            <Page.Subtitle variant="h6">{noRecordsLabel}</Page.Subtitle>
          </Page>
        }
        onPageNumberChange={(pageNumber) => handlePageChange({ pageNumber })}
        onPageSizeChange={(pageSize) => handlePageChange({ pageSize, pageNumber: 1 })}
      />
    </TableLayout>
  );
};

export default Catalog;
