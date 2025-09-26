import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  resetDepartmentsFetchStatus,
  selectDepartment,
  selectDepartmentCatalog,
  selectUserRoles,
  updateDepartmentsPagination,
  resetDepartmentsPagination,
} from 'store/features';
import { deleteDepartment, fetchDepartments } from 'store/thunks';
import { Department, Module, PaginationParams, SubModule, UserRole } from 'shared/models';
import {
  ACTION_FIELDS,
  APP_CONFIG,
  DEPARTMENT_FIELDS,
  DEPARTMENT_TABLE_ACTIONS_SCHEMA,
  DEPARTMENT_TABLE_SCHEMA,
  ROUTES,
} from 'shared/constants';
import { getTestSelectorByModule } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import Page from 'components/UI/Page';
import Table, { ActionsMenu, mapTableActionsColumn } from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import { renderPrimaryLinkText } from 'components/UI/helpers/renderPrimaryLinkText';

const testModule = Module.departmentManagement;
const testSubModule = SubModule.departmentCatalog;

const DepartmentCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    status: fetchStatus,
    items: departments,
    page = APP_CONFIG.table.defaultPagination as PaginationParams,
  } = useAppSelector(selectDepartmentCatalog);
  const { deleteStatus } = useAppSelector(selectDepartment);
  const userRoles = useAppSelector(selectUserRoles);
  const { searchTerm: search, searchTermChanged, setSearchTermChanged, setPortalProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const loading = fetchStatus === 'loading' || deleteStatus === 'loading';
  const handleNavigate = (path: string) => navigate(path);

  const handleDepartmentAction = (department: Department, action: keyof typeof ACTION_FIELDS) => {
    switch (action) {
      case 'view':
        handleNavigate(generatePath(ROUTES.viewDepartment.path, { id: department.id }));
        break;
      case 'edit':
        handleNavigate(generatePath(ROUTES.editDepartment.path, { id: department.id }));
        break;
      case 'delete':
        if (page.pageNumber! > 1 && departments.length === 1) {
          dispatch(updateDepartmentsPagination({ pageNumber: page.pageNumber! - 1 }));
        }
        dispatch(deleteDepartment(department.id));
        break;
    }
  };

  const handlePageChange = (pagination: Partial<PaginationParams>) => {
    dispatch(resetDepartmentsFetchStatus());
    dispatch(updateDepartmentsPagination({ ...pagination, search }));
  };

  const actions = DEPARTMENT_TABLE_ACTIONS_SCHEMA.map((action) => ({
    ...action,
    onClick: (department: Department) => handleDepartmentAction(department, action.field as keyof typeof ACTION_FIELDS),
  }));

  const columns = mapTableActionsColumn(
    DEPARTMENT_TABLE_SCHEMA.map((column) =>
      column.field === DEPARTMENT_FIELDS.name.field
        ? {
            ...column,
            renderBodyCell: (department: Department) =>
              renderPrimaryLinkText({
                item: department,
                getText: ({ name }) => name,
                onClick: () => handleDepartmentAction(department, 'view'),
              }),
          }
        : column
    ),
    (department) => (
      <ActionsMenu<Department> module={testModule} subModule={testSubModule} actions={actions} context={department} userRoles={userRoles} />
    )
  );

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchDepartments([page]));
    }
  }, [fetchStatus, page, dispatch]);

  React.useEffect(() => {
    setPortalProps({
      label: 'Search Departments',
      testSelector: getTestSelectorByModule(testModule, testSubModule, 'search-departments'),
    });
  }, [setPortalProps]);

  React.useEffect(() => {
    if (searchTermChanged) {
      dispatch(resetDepartmentsFetchStatus());
      dispatch(updateDepartmentsPagination({ search, pageNumber: 1 }));
      setSearchTermChanged(false);
    }
  }, [search, searchTermChanged, setSearchTermChanged, dispatch]);

  useUnmount(() => {
    if (search) {
      dispatch(resetDepartmentsFetchStatus());
      dispatch(resetDepartmentsPagination());
    }
  });

  return (
    <TableLayout
      module={testModule}
      subModule={testSubModule}
      userRoles={userRoles}
      allowedRoles={[UserRole.administrator]}
      pageTitle="Departments"
      actionButtonLabel="New Department"
      onActionClick={() => handleNavigate(ROUTES.newDepartment.path)}
    >
      <Table<Department>
        module={testModule}
        subModule={testSubModule}
        loading={loading}
        columns={columns}
        items={departments}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page module={testModule} subModule={testSubModule} sx={{ m: 0 }}>
            <Page.Subtitle variant="h6">No Departments Found</Page.Subtitle>
          </Page>
        }
        onPageNumberChange={(pageNumber) => handlePageChange({ pageNumber })}
        onPageSizeChange={(pageSize) => handlePageChange({ pageSize, pageNumber: 1 })}
      />
    </TableLayout>
  );
};

export default DepartmentCatalogPage;
