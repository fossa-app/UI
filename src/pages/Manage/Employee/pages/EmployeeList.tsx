import { fetchEmployees, selectEmployees } from 'store/features';
import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import Box from '@mui/material/Box';
import Page, { PageSubtitle, PageTitle } from 'components/Page';
import { Employee } from 'shared/models';
import { EMPLOYEE_FIELDS } from 'shared/constants';
import Table, { Column } from 'components/UI/Table';

const EmployeeListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: employees } = useAppSelector(selectEmployees);

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

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchEmployees({ pageNumber: 1, pageSize: 10 }));
    }
  }, [fetchStatus]);

  return (
    <Box>
      <Page>
        <PageTitle>Employees</PageTitle>
      </Page>
      <Table loading={fetchStatus === 'loading'} columns={columns} items={employees?.items} noRecords={noRecordsTemplate} />
    </Box>
  );
};

export default EmployeeListPage;
