import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, resetEmployeesFetchStatus, selectEmployees, selectUserRoles, setEmployeesPagination } from 'store/features';
import { Employee, Module, SubModule } from 'shared/models';
import { APP_CONFIG, EMPLOYEE_TABLE_SCHEMA } from 'shared/constants';
import { getTestSelectorByModule, mapTableColumnsByRoles } from 'shared/helpers';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';

const EmployeeTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page } = useAppSelector(selectEmployees);
  const userRoles = useAppSelector(selectUserRoles);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;
  const columns = mapTableColumnsByRoles(EMPLOYEE_TABLE_SCHEMA, userRoles);

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
    dispatch(setEmployeesPagination({ ...page, pageNumber, pageSize }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(resetEmployeesFetchStatus());
    dispatch(setEmployeesPagination({ ...page, pageSize, pageNumber: 1 }));
  };

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchEmployees({ pageNumber, pageSize }));
    }
  }, [fetchStatus, pageNumber, pageSize, dispatch]);

  return (
    <TableLayout module={Module.employeeManagement} subModule={SubModule.employeeTable} pageTitle="Employees">
      <Table<Employee>
        module={Module.employeeManagement}
        subModule={SubModule.employeeTable}
        loading={fetchStatus === 'loading'}
        columns={columns}
        items={employees?.items}
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

export default EmployeeTablePage;
