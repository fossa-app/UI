import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, selectEmployees, setEmployeesPagination } from 'store/features';
import { Employee } from 'shared/models';
import { APP_CONFIG, EMPLOYEE_FIELDS } from 'shared/constants';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table, { Column } from 'components/UI/Table';
import TableLayout from '../../components/TableLayout';

const EmployeeTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page } = useAppSelector(selectEmployees);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;

  const columns: Column<Employee>[] = [
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
      <PageSubtitle fontSize={20}>No Employees Found</PageSubtitle>
    </Page>
  );

  const handlePageNumberChange = (pageNumber: number) => {
    dispatch(setEmployeesPagination({ ...page, pageNumber, pageSize }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setEmployeesPagination({ ...page, pageSize, pageNumber: 1 }));
  };

  React.useEffect(() => {
    dispatch(fetchEmployees({ pageNumber, pageSize }));
  }, [pageNumber, pageSize, dispatch]);

  return (
    <TableLayout pageTitle="Employees">
      <Table<Employee>
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
