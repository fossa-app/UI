import * as React from 'react';
import Box from '@mui/system/Box';
import Page, { PageTitle, PageSubtitle } from 'components/Page';

const EmployeesPage: React.FC = () => {
  return (
    <Box>
      <Page>
        <PageTitle>Employees</PageTitle>
        <PageSubtitle>Manage Employees</PageSubtitle>
      </Page>
    </Box>
  );
};

export default EmployeesPage;
