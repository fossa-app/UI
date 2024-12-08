import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, resetEmployeesFetchStatus, selectEmployees, setEmployeesPagination } from 'store/features';
import { EmployeeDTO, Module, SubModule } from 'shared/models';
import { APP_CONFIG, EMPLOYEE_FIELDS } from 'shared/constants';
import { getTestSelectorByModule } from 'shared/helpers';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table, { Column } from 'components/UI/Table';
import TableLayout from 'components/layouts/TableLayout';

const EmployeeTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page } = useAppSelector(selectEmployees);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;

  const columns: Column<EmployeeDTO>[] = [
    {
      name: EMPLOYEE_FIELDS.firstName.name,
      field: EMPLOYEE_FIELDS.firstName.field,
      width: 200,
    },
    {
      name: EMPLOYEE_FIELDS.lastName.name,
      field: EMPLOYEE_FIELDS.lastName.field,
      width: 200,
    },
    {
      name: EMPLOYEE_FIELDS.fullName.name,
      field: EMPLOYEE_FIELDS.fullName.field,
      width: 'auto',
    },
  ];

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
      <Table<EmployeeDTO>
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
