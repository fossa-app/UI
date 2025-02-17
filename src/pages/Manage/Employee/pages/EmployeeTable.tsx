import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, resetEmployeesFetchStatus, selectEmployees, selectUserRoles, setEmployeesPagination } from 'store/features';
import { Employee, Module, PaginationParams, SubModule } from 'shared/models';
import { ACTION_FIELDS, APP_CONFIG, EMPLOYEE_FIELDS, EMPLOYEE_TABLE_ACTIONS_SCHEMA, EMPLOYEE_TABLE_SCHEMA, ROUTES } from 'shared/constants';
import { filterTableActionsByRoles, getTestSelectorByModule, mapTableActionsColumn } from 'shared/helpers';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';
import ActionsMenu from 'components/UI/Table/ActionsMenu';
import { renderPrimaryLinkText } from 'components/UI/PrimaryLinkText';

const EmployeeTablePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page = APP_CONFIG.table.defaultPagination as PaginationParams } = useAppSelector(selectEmployees);
  const userRoles = useAppSelector(selectUserRoles);
  const { search, searchChanged, setSearchChanged, setProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;

  const noRecordsTemplate = (
    <Page sx={{ my: 0 }}>
      <PageSubtitle
        data-cy={getTestSelectorByModule(Module.employeeManagement, SubModule.employeeTable, 'table-no-employees')}
        fontSize={20}
      >
        No Employees Found
      </PageSubtitle>
    </Page>
  );

  const handlePageNumberChange = (pageNumber: number) => {
    dispatch(resetEmployeesFetchStatus());
    dispatch(setEmployeesPagination({ pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(resetEmployeesFetchStatus());
    dispatch(setEmployeesPagination({ pageSize, pageNumber: 1 }));
  };

  const handleViewEmployee = ({ id }: Employee) => {
    const viewPath = generatePath(ROUTES.viewEmployee.path, { id });

    navigate(viewPath);
  };

  const handleEditEmployee = ({ id }: Employee) => {
    const editPath = generatePath(ROUTES.editEmployee.path, { id });

    navigate(editPath);
  };

  const actionHandlers = {
    [ACTION_FIELDS.view.field]: handleViewEmployee,
    [ACTION_FIELDS.edit.field]: handleEditEmployee,
  };

  const actions = filterTableActionsByRoles<Employee>(EMPLOYEE_TABLE_ACTIONS_SCHEMA, userRoles).map((action) => ({
    ...action,
    onClick: actionHandlers[action.field],
  }));

  const renderActionButtons = (employee: Employee) => (
    <ActionsMenu<Employee> module={Module.employeeManagement} subModule={SubModule.employeeTable} actions={actions} context={employee} />
  );

  // TODO: find better solution, e.g. like renderActionButtons
  const mappedCellActions = EMPLOYEE_TABLE_SCHEMA.map((column) => {
    return {
      ...column,
      ...(column.field === EMPLOYEE_FIELDS.firstName.field && {
        renderBodyCell: (employee: Employee) =>
          renderPrimaryLinkText({
            item: employee,
            getText: ({ firstName }) => firstName,
            onClick: handleViewEmployee,
          }),
      }),
    };
  });

  const columns = mapTableActionsColumn(mappedCellActions, renderActionButtons);

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchEmployees(page));
    }
  }, [fetchStatus, page, dispatch]);

  React.useEffect(() => {
    setProps({ label: 'Search Employees', testSelector: 'search-employees' });
  }, [setProps]);

  React.useEffect(() => {
    if (searchChanged) {
      dispatch(resetEmployeesFetchStatus());
      dispatch(setEmployeesPagination({ search }));
      setSearchChanged(false);
    }
  }, [search, searchChanged, dispatch, setSearchChanged]);

  return (
    <TableLayout module={Module.employeeManagement} subModule={SubModule.employeeTable} pageTitle="Employees">
      <Table<Employee>
        module={Module.employeeManagement}
        subModule={SubModule.employeeTable}
        loading={fetchStatus === 'loading'}
        columns={columns}
        items={employees?.items}
        pageNumber={page.pageNumber!}
        pageSize={page.pageSize!}
        totalItems={page.totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={noRecordsTemplate}
        onPageNumberChange={handlePageNumberChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </TableLayout>
  );
};

export default EmployeeTablePage;
