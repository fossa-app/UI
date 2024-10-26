import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, selectEmployees, setEmployeesPagination } from 'store/features';
import { Employee } from 'shared/models';
import { APP_CONFIG, EMPLOYEE_FIELDS } from 'shared/constants';
import Page, { PageSubtitle, PageTitle } from 'components/UI/Page';
import Table, { Column } from 'components/UI/Table';

const EmployeeTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees, page } = useAppSelector(selectEmployees);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;

  const columns: Column<Employee>[] = [
    {
      name: EMPLOYEE_FIELDS.firstName.name,
      field: EMPLOYEE_FIELDS.firstName.field,
    },
    {
      name: EMPLOYEE_FIELDS.lastName.name,
      field: EMPLOYEE_FIELDS.lastName.field,
    },
    {
      name: EMPLOYEE_FIELDS.fullName.name,
      field: EMPLOYEE_FIELDS.fullName.field,
    },
  ];

  const noRecordsTemplate = (
    <Page>
      <PageSubtitle>No Employees Found</PageSubtitle>
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
    <Box>
      <Page>
        <PageTitle>Employees</PageTitle>
      </Page>
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
    </Box>
  );
};

export default EmployeeTablePage;
