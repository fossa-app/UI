import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, resetEmployeesFetchStatus, selectEmployees, setEmployeesPagination } from 'store/features';
import { Employee, Module, PaginationParams, SubModule } from 'shared/models';
import { APP_CONFIG, EMPLOYEE_TABLE_SCHEMA } from 'shared/constants';
import { getTestSelectorByModule } from 'shared/helpers';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';
import { useSearch } from 'components/Search';

const EmployeeTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page = APP_CONFIG.table.defaultPagination as PaginationParams } = useAppSelector(selectEmployees);
  const { search, searchChanged, setSearchChanged, setProps } = useSearch();
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const columns = EMPLOYEE_TABLE_SCHEMA;

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
