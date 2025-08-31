import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  deleteDepartment,
  fetchDepartments,
  resetDepartmentsFetchStatus,
  selectDepartment,
  selectDepartments,
  selectUserRoles,
  updateDepartmentsPagination,
  resetDepartmentsPagination,
} from 'store/features';
import { Department, Module, PaginationParams, SubModule, UserRole } from 'shared/models';
import {
  ACTION_FIELDS,
  APP_CONFIG,
  DEPARTMENT_FIELDS,
  DEPARTMENT_TABLE_ACTIONS_SCHEMA,
  DEPARTMENT_TABLE_SCHEMA,
  ROUTES,
} from 'shared/constants';
import { getTestSelectorByModule, mapTableActionsColumn } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import Page from 'components/UI/Page';
import Table from 'components/UI/Table';
import ActionsMenu from 'components/UI/Table/ActionsMenu';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import { renderPrimaryLinkText } from 'components/UI/helpers/renderPrimaryLinkText';

const testModule = Module.departmentManagement;
const testSubModule = SubModule.departmentCatalog;

const DepartmentCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    fetchStatus,
    data: departments,
    page = APP_CONFIG.table.defaultPagination as PaginationParams,
  } = useAppSelector(selectDepartments);
  const { deleteStatus } = useAppSelector(selectDepartment);
  const userRoles = useAppSelector(selectUserRoles);
  const { searchTerm: search, searchTermChanged, setSearchTermChanged, setPortalProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const loading = fetchStatus === 'loading' || deleteStatus === 'loading';
  const handleNavigate = React.useCallback((path: string) => navigate(path), [navigate]);

  const handleDepartmentAction = React.useCallback(
    (department: Department, action: keyof typeof ACTION_FIELDS) => {
      switch (action) {
        case 'view':
          handleNavigate(generatePath(ROUTES.viewDepartment.path, { id: department.id }));
          break;
        case 'edit':
          handleNavigate(generatePath(ROUTES.editDepartment.path, { id: department.id }));
          break;
        case 'delete':
          if (page.pageNumber! > 1 && departments?.items.length === 1) {
            dispatch(updateDepartmentsPagination({ pageNumber: page.pageNumber! - 1 }));
          }
          dispatch(deleteDepartment(department.id));
          break;
      }
    },
    [handleNavigate, dispatch, page.pageNumber, departments?.items.length]
  );

  const handlePageChange = React.useCallback(
    (pagination: Partial<PaginationParams>) => {
      dispatch(resetDepartmentsFetchStatus());
      dispatch(updateDepartmentsPagination(pagination));
    },
    [dispatch]
  );

  const actions = React.useMemo(
    () =>
      DEPARTMENT_TABLE_ACTIONS_SCHEMA.map((action) => ({
        ...action,
        onClick: (department: Department) => handleDepartmentAction(department, action.field as keyof typeof ACTION_FIELDS),
      })),
    [handleDepartmentAction]
  );

  const columns = React.useMemo(
    () =>
      mapTableActionsColumn(
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
          <ActionsMenu<Department>
            module={testModule}
            subModule={testSubModule}
            actions={actions}
            context={department}
            userRoles={userRoles}
          />
        )
      ),
    [actions, userRoles, handleDepartmentAction]
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
      handlePageChange({ search, pageNumber: 1 });
      setSearchTermChanged(false);
    }
  }, [search, searchTermChanged, handlePageChange, setSearchTermChanged]);

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
        items={departments?.items}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page module={testModule} subModule={testSubModule} sx={{ margin: 0 }}>
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
