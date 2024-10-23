import * as React from 'react';
import Box from '@mui/system/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchEmployees, selectEmployees } from 'store/features';
import Page, { PageTitle, PageSubtitle } from 'components/Page';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const EmployeesPage: React.FC = () => {
  const { fetchStatus, data: employees } = useAppSelector(selectEmployees);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchEmployees({ pageNumber: 1, pageSize: 10 }));
    }
  }, [fetchStatus]);

  return (
    <Box>
      <Page>
        <PageTitle>Employees</PageTitle>
        <PageSubtitle>Manage Employees</PageSubtitle>
        <List>
          {employees?.items.length &&
            employees.items.map((item) => {
              return (
                <ListItem disablePadding key={item.id}>
                  {item.fullName}
                </ListItem>
              );
            })}
        </List>
      </Page>
    </Box>
  );
};

export default EmployeesPage;
