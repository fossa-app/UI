import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import {
  fetchEmployees,
  resetEmployeesFetchStatus,
  resetEmployeesPagination,
  selectEmployees,
  selectUserRoles,
  updateEmployeesPagination,
} from 'store/features';
import { Employee, Module, PaginationParams, SubModule } from 'shared/models';
import { ACTION_FIELDS, APP_CONFIG, EMPLOYEE_FIELDS, EMPLOYEE_TABLE_ACTIONS_SCHEMA, EMPLOYEE_TABLE_SCHEMA, ROUTES } from 'shared/constants';
import { getTestSelectorByModule, mapTableActionsColumn } from 'shared/helpers';
import { useUnmount } from 'shared/hooks';
import Page from 'components/UI/Page';
import Table from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import ActionsMenu from 'components/UI/Table/ActionsMenu';
import { renderPrimaryLinkText } from 'components/UI/PrimaryLinkText';

const testModule = Module.employeeManagement;
const testSubModule = SubModule.employeeCatalog;

const EmployeeCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page = APP_CONFIG.table.defaultPagination as PaginationParams } = useAppSelector(selectEmployees);
  const userRoles = useAppSelector(selectUserRoles);
  const { search, searchChanged, setSearchChanged, setProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const handleNavigate = React.useCallback((path: string) => navigate(path), [navigate]);

  const handleEmployeeAction = React.useCallback(
    (employee: Employee, action: keyof typeof ACTION_FIELDS) => {
      switch (action) {
        case 'view':
          handleNavigate(generatePath(ROUTES.viewEmployee.path, { id: employee.id }));
          break;
        case 'edit':
          handleNavigate(generatePath(ROUTES.editEmployee.path, { id: employee.id }));
          break;
      }
    },
    [handleNavigate]
  );

  const handlePageChange = React.useCallback(
    (pagination: Partial<PaginationParams>) => {
      dispatch(resetEmployeesFetchStatus());
      dispatch(updateEmployeesPagination(pagination));
    },
    [dispatch]
  );

  const actions = React.useMemo(
    () =>
      EMPLOYEE_TABLE_ACTIONS_SCHEMA.map((action) => ({
        ...action,
        onClick: (employee: Employee) => handleEmployeeAction(employee, action.field as keyof typeof ACTION_FIELDS),
      })),
    [handleEmployeeAction]
  );

  const columns = React.useMemo(
    () =>
      mapTableActionsColumn(
        EMPLOYEE_TABLE_SCHEMA.map((column) =>
          column.field === EMPLOYEE_FIELDS.firstName.field
            ? {
                ...column,
                renderBodyCell: (employee: Employee) =>
                  renderPrimaryLinkText({
                    item: employee,
                    getText: ({ firstName }) => firstName,
                    onClick: () => handleEmployeeAction(employee, 'view'),
                  }),
              }
            : column
        ),
        (employee) => (
          <ActionsMenu<Employee> module={testModule} subModule={testSubModule} actions={actions} context={employee} userRoles={userRoles} />
        )
      ),
    [actions, userRoles, handleEmployeeAction]
  );

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchEmployees([page]));
    }
  }, [fetchStatus, page, dispatch]);

  React.useEffect(() => {
    setProps({
      label: 'Search Employees',
      testSelector: getTestSelectorByModule(testModule, testSubModule, 'search-employees'),
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
      dispatch(resetEmployeesFetchStatus());
      dispatch(resetEmployeesPagination());
    }
  });

  return (
    <TableLayout module={testModule} subModule={testSubModule} allowedRoles={[]} pageTitle="Employees">
      <Table<Employee>
        module={testModule}
        subModule={testSubModule}
        loading={fetchStatus === 'loading'}
        columns={columns}
        items={employees?.items}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={
          <Page module={testModule} subModule={testSubModule} sx={{ my: 0 }}>
            <Page.Subtitle variant="h6">No Employees Found</Page.Subtitle>
          </Page>
        }
        onPageNumberChange={(pageNumber) => handlePageChange({ pageNumber })}
        onPageSizeChange={(pageSize) => handlePageChange({ pageSize, pageNumber: 1 })}
      />
    </TableLayout>
  );
};

export default EmployeeCatalogPage;
